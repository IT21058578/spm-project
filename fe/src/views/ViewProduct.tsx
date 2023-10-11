import React, { useEffect } from 'react'
import Footer from './includes/Footer';
import Header from './includes/Header';
import Banner from '../components/Banner';
import Spinner from '../components/Spinner';
import NotFound from "../components/404";
import ProductDetails from '../components/ProductDetails';
import { useParams } from 'react-router-dom';
import { useGetProductQuery } from "../store/apiquery/productApiSlice"
import { sortProducts } from './VirtualData';

const ViewProduct = () => {

  const params = useParams()

  // const productId = params.id ? parseInt(params.id, 10) : null;
  // Handle the case where params.id is undefined

  // Find the product with the matching ID in sortProducts array
  // const selectedProduct = sortProducts.find((product) => product.id === productId);

  const { isLoading, data : details , isSuccess, isError } = useGetProductQuery(params.id || '');

  return (
    <>
        <Header />
        <Banner page="Shop Details" path={["Home", "Shop Details"]}/>
        {
          !isLoading && isSuccess ? 
          <ProductDetails product={details}/> 
          : 
          (isError ? <NotFound /> : <Spinner />)
        }
        
        {/* new code for navigating dummy data */}
        {/* {selectedProduct ? (
          <ProductDetails product={selectedProduct} />
        ) : (
          <NotFound />
        )} */}
        <Footer />
    </>
  )
}

export default ViewProduct;