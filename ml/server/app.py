import os
import json

import pandas as pd
import numpy as np
import pickle as pkl

from bson import ObjectId
from sklearn.pipeline import Pipeline
from typing import List, Dict
from flask import Flask, request
from operator import itemgetter
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()

# Load env variables and others
MONGO_URI = os.getenv('MONGO_URI')
DB_NAME = os.getenv('DB_NAME')
TAG_IDX_MAP = json.load(
    open(os.path.join(os.getcwd(), 'server', 'product-idx-map.json')))

# Loading model
file = open(os.path.join(os.getcwd(), 'server', 'model.pkl'), "rb")
MODEL: Pipeline = pkl.load(file)
file.close()

# Loading additional ata
file = open(os.path.join(os.getcwd(), 'server', 'data.pkl'), 'rb')
CLUST_DATA: Dict = pkl.load(file)
file.close()

app = Flask(__name__)

# Mongo
client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
db = client[DB_NAME]
products_coll = db['products']
orders_coll = db['orders']


@app.route("/products/recommendations", methods=['POST'])
def getRecommendations():
    userId = request.json.get('userId')
    cartProductIds = request.json.get('cartProductIds')
    currentProductId = request.json.get('currentProductId')
    metadata = request.json.get('metadata')

    # Start building list of things to not recommend
    excludedProductIds = np.array([])
    # For ML Model processing
    userTagCounts = np.array([0] * len(TAG_IDX_MAP.keys()))

    if (currentProductId is not None):
        np.append(excludedProductIds, currentProductId)
        currentProduct = products_coll.find_one(ObjectId(userId))
        if (currentProduct is not None):
            # Tags of current product are weighted extra
            adjustTagWeights(currentProduct, userTagCounts, 4)

    if (cartProductIds is not None):
        np.append(excludedProductIds, cartProductIds)

    if (userId is not None):
        userOrders = orders_coll.find({"createdBy": userId})
        userProductIds = []
        for order in userOrders:
            userProductIds = list(dict(order['items']).keys())
            np.append(excludedProductIds, userProductIds)

        userProducts = products_coll.find({"_id": {"$in": userProductIds}})
        for product in userProducts:
            adjustTagWeights(product, userTagCounts, 1)

    # TODO: Predict the user's cluster and get the weights
    userTagWeights = getPredictedTagWeights(userTagCounts)

    # Calculating scores
    allProducts = pd.DataFrame(products_coll.find()).set_index('_id').drop(
        ['type', 'brand', 'price', 'images'], axis='columns')
    allProducts = allProducts.drop(excludedProductIds)
    # Drop all products that are unavailable or bought
    allProducts: pd.DataFrame = allProducts.loc[allProducts['countInStock'].values != 0]
    allProducts['allTags'] = allProducts.apply(createAllTagsCol, axis=1)
    productScores = allProducts['allTags'].apply(
        lambda x: np.dot(userTagWeights, x)).sort_values(ascending=False)

    # TODO: Now we need to adjust these scores based on recency.
    # print(productScores)

    # We pick and return the products according to metadata.
    pageSize = 5
    pageNum = 1
    if metadata is not None:
        pageSize: int = metadata.get('pageSize') if metadata.get(
            'pageSize') is not None else 5
        pageNum: int = metadata.get('pageNum') if metadata.get(
            'pageNum') is not None else 1

    returnedProductIds = list(map(lambda x: str(x), productScores.index.values[(
        (pageNum - 1) * pageSize): ((pageNum) * pageSize)].tolist()))
    print(returnedProductIds)
    return returnedProductIds


def createAllTagsCol(row):
    temp = [0] * len(TAG_IDX_MAP.keys())
    # Same function can be used to prepare this.
    adjustTagWeights(row, temp, 1)
    return temp


def adjustTagWeights(product: Dict, tagList: np.ndarray, weight: int) -> None:
    if ('color' in product):
        if (product['color'] in TAG_IDX_MAP):
            tagList[TAG_IDX_MAP[product['color']]] += weight

    if ('tags' in product):
        if (isinstance(product['tags'], list)):
            for tag in product['tags']:
                if (tag in TAG_IDX_MAP):
                    tagList[TAG_IDX_MAP[tag]] += weight


def getPredictedTagWeights(counts):
    df = pd.DataFrame(np.array(counts).reshape(1, -1))
    predicted_clust = MODEL.predict(df)[0]
    print(f'The predicted cluster is: {predicted_clust}')
    return CLUST_DATA['cluster_weights_'][predicted_clust]
