import os
import json

import pandas as pd
import numpy as np

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
TAG_IDX_MAP = json.load(open('./product-idx-map.json'))

app = Flask(__name__)

# Mongo
client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
db = client[DB_NAME]
products_coll = db['products']
orders_coll = db['orders']

@app.route("/api/product/recommendations", methods=['POST'])
def getRecommendations():
    userId, cartProductIds, currentProductId, metadata = itemgetter('userId', 'cartProductIds', 'currentProductId', 'metadata')(request.json)
    
    excludedProductIds = np.array([]) # Start building list of things to not recommend
    userTagCounts = [0] * len(TAG_IDX_MAP.keys()) # For ML Model processing

    if (currentProductId is not None) :
        excludedProductIds.append(currentProductId)
        currentProduct = products_coll.find_one({"_id": userId})
        adjustTagWeights(currentProduct, userTagCounts, 4)  # Tags of current product are weighted extra 

    if (cartProductIds is not None) :
        excludedProductIds.insert(cartProductIds)

    if (userId is not None):
        userOrders = orders_coll.find({"createdBy": userId})
        userProductIds = []
        for order in userOrders:
            userProductIds = order.items.keys()
            excludedProductIds.insert(userProductIds)

        userProducts = products_coll.find({"_id": {"$in": userProductIds}})
        for product in userProducts:
            adjustTagWeights(product, userTagCounts, 1)

    # TODO: Predict the user's cluster and get the weights
    userTagWeights = np.array([])

    # Calculating scores
    allProducts = pd.DataFrame(products_coll.find()).set_index('_id').drop(['type', '_v', 'brand', 'price', 'createdAt', 'images'])
    allProducts = allProducts.drop(excludedProductIds)
    allProducts: pd.DataFrame = allProducts.loc[allProducts['countInStock'].values != 0 ] # Drop all products that are unavailable or bought
    allProducts['allTags'] = allProducts.apply(createAllTagsCol ,axis=1)
    productScores = allProducts['allTags'].apply(lambda x: np.dot(userTagWeights, x)).sort_values(ascending=False)

    # TODO: Now we need to adjust these scores based on recency.
    print(productScores)

    # We pick and return the products according to metadata.
    pageSize: int = metadata['pageSize'] if metadata['pageSize'] is not None else 5
    pageNum: int = metadata['pageNum'] if metadata['pageNum'] is not None else 1
    returnedProductIds = productScores.index.values[((pageNum - 1) * pageSize): ((pageNum) * pageSize)];
    returnedProducts = pd.find({"_id": {"$in": returnedProductIds}})
    return returnedProducts

def createAllTagsCol(row):
    temp = [0] * len(TAG_IDX_MAP.keys())
    adjustTagWeights(row, temp, 1)
    return temp

def adjustTagWeights(product: Dict, tagList: np.ndarray, weight: int) -> None:
    if ('color' in product and product['color'] in TAG_IDX_MAP):
            tagList[TAG_IDX_MAP[product['color']]] += weight;
        
    if ('tags' in product and isinstance(product['tags'], list)):
        for tag in product['tags']:
            if (tag in TAG_IDX_MAP):
                tagList[TAG_IDX_MAP[tag]] += weight;