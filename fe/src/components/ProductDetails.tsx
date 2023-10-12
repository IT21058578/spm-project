import React from 'react'
import Reviews from './Reviews'
import NumberCount from './NumberCount'
import { PopularProducts } from '../views/includes/Section'
import { Carousel } from 'react-responsive-carousel'
import AddToCart from './AddToCart'
import { ProductType } from './ProductCart'
import { Link } from 'react-router-dom'
import RoutePaths from '../config'
import { useGetAllReviewQuery } from '../store/apiquery/ReviewApiSlice'
import { Review } from '../types'
import { useState } from 'react'
import ReviewForm from './ReviewForm'
import { getItem } from '../Utils/Generals'

const isLogged = getItem(RoutePaths.token);
const user = !isLogged ? null : JSON.parse(getItem("user") || "");

const ProductDetails = ({product} : {product : ProductType}) => {

  const [activeTab, setActiveTab] = useState('description');

  const [data, setData] = useState(user);


  const handleTabClick = (tabName:any, e:any) => {
    e.preventDefault(); // Prevent the page from scrolling to the top
    setActiveTab(tabName);
  };

  const { data:reviews, isLoading, isError } = useGetAllReviewQuery("api/reviews");

    // Filter reviews for the specific product
  const filteredReviews = reviews?.content.filter((review: Review) => review.productId === product._id) || [];

  console.log('Reviews:', reviews);
  console.log('Product ID:', product._id);


    // Calculate the average rating
  const totalRating = filteredReviews.reduce((sum:any, review:any) => sum + review.rating, 0);
  const averageRating = filteredReviews.length > 0 ? totalRating / filteredReviews.length : 0;

  return (
    <div className='view-product px-3 px-lg-5'>
        <div className="details-generals border border-1 fd-hover-border-primary bg-white row text-black justify-content-between p-5 gap-2 mt-5" style={{minHeight : '400px'}}>
            <div className='p-img col-12 col-lg-6'>
                <div className="product-img col-9 h-25">
                    <Carousel showArrows={false} showIndicators={false} swipeable={true}>
                        <div className="others-img"><img src={product.images[0]} alt="Alt" /></div>
                        <div className="others-img"><img src={product.images[1]} alt="Alt" /></div>
                        <div className="others-img"><img src={product.images[2]} alt="Alt" /></div>
                        <div className="others-img"><img src={product.images[3]} alt="Alt" /></div>
                    </Carousel>
                    {/* <Carousel showArrows={false} showIndicators={false} swipeable={true}>
                        <div className="others-img"><img src={product.img} alt="Alt" /></div>
                        <div className="others-img"><img src={product.img} alt="Alt" /></div>
                        <div className="others-img"><img src={product.img} alt="Alt" /></div>
                        <div className="others-img"><img src={product.img} alt="Alt" /></div>
                    </Carousel> */}
                </div>
            </div>
            <div className="p-details col-12 col-lg-5">
                <div className='d-flex flex-wrap gap-2'>
                    <Reviews rating={averageRating}/><span className='fd-color-primary'>({filteredReviews.length} Reviews)</span></div>
                <h3 className="fw-bold my-4">{product.name}</h3>
                <p className='fw-bold opacity-75'>{product.brand}</p>
                <div className="d-flex flex-wrap gap-2">
                    <h1 className="fw-bold fd-color-primary">RS {product.price}</h1>
                    <h2 className="fw-bold align-self-end" style={{textDecoration : "line-through"}}>RS {product.price+product.price}</h2>
                </div><hr />
                <div className="categories-list d-flex flex-wrap gap-2">
                    <h5 className="fw-bold">Categories : </h5>
                    <div><span> Linen,</span><span> Comfirt,</span><span> Premium,</span><span> Durable</span></div>
                </div><hr />
                <div className="p-types d-flex flex-wrap gap-2 align-items-center">
                    <h5 className="fw-bold d-flex flex-wrap gap-2 mb-0">Colors : </h5>
                    <div className='d-flex flex-wrap gap-2'>
                        <span className='p-color bg-danger'></span><span className='p-color bg-warning'></span>
                        <span className='p-color bg-info'></span><span className='p-color bg-primary'></span><span className='p-color bg-secondary'></span>
                    </div>
                </div>
                <div className="p-types d-flex flex-wrap gap-2 align-items-center mt-3">
                    <h5 className="fw-bold d-flex flex-wrap gap-2 mb-0">SIZE : </h5>
                    <div className='d-flex flex-wrap gap-2 opacity-75'>
                        <span className='border border-1 p-1 rounded-2 cursor-pointer'>Small</span>
                        <span className='border border-1 p-1 rounded-2 cursor-pointer'>Medium</span>
                        <span className='border border-1 p-1 rounded-2 cursor-pointer'>Large</span>
                        <span className='border border-1 p-1 rounded-2 cursor-pointer'>Extra Large</span>
                    </div>
                </div>
                <div className='d-flex flex-wrap gap-2 my-4'>
                    <NumberCount product={product} min={1} />
                    <AddToCart product={product} divClass='align-self-center'/>
                </div>
                <div className="p-share d-flex flex-wrap gap-2 align-items-center">
                    <h5 className="fw-bold d-flex flex-wrap gap-2 mb-0">Share : </h5>
                    <div className='d-flex flex-wrap gap-2'>
                        <div><a href="#" className='text-black'><i className="bi bi-facebook"></i></a></div>
                        <div><a href="#" className='text-black'><i className="bi bi-twitter"></i></a></div>
                        <div><a href="#" className='text-black'><i className="bi bi-pinterest"></i></a></div>
                        <div><a href="#" className='text-black'><i className="bi bi-instagram"></i></a></div>
                    </div>
                </div>
            </div>
        </div>
        <div className="p-desc p-5 my-5 bg-white border border-1 text-black" style={{ minHeight: '400px' }}>
        <div className='tab-title fw-bold d-flex flex-wrap gap-2'>
            <div className='t-t'>
                <a
                className={`fd-color-primary ${activeTab === 'description' ? 'active' : ''}`}
                href="#"
                onClick={(e) => handleTabClick('description', e)}
                >
                Description
                </a>
            </div>
            <div className='t-t'>
                <a
                className={`fd-color-primary ${activeTab === 'reviews' ? 'active' : ''}`}
                href="#"
                onClick={(e) => handleTabClick('reviews', e)}
                >
                Reviews
                </a>
            </div>
            <style>{`
                .t-t a.active {
                    border-bottom: 4px solid #E95793;
                    border-radius: 3px;
                    color: #E95793;
                }
            `}</style>
            </div>
            <hr />
            <div className="opacity-50 fw-bold mt-2">
                <div className="tab-content">
                {activeTab === 'description' && (
                    <p>{product.type}</p>
                )}
                {activeTab === 'reviews' && (

                  <div>
                    <div>
                    {data._id && <ReviewForm userId={data._id} ProductId={product._id}/>}
                    </div>
                    {filteredReviews.length === 0 ? (
                        <p>No reviews available</p>
                    ) : (
                        filteredReviews.map((review: any) => (
                        <div
                            key={review.id}
                            className="review-card"
                            style={{
                            color: '#DA0C81',
                            borderRadius: '4px',
                            padding: '5px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <div className="rating">{review.rating} stars</div>
                            <p className="review-description" style={{ color: 'darkblue' }}>{review.description}</p>
                        </div>
                        ))
                    )}
                  </div>
                )}
                </div>
            </div>
        </div>
        <div className="related-products text-black my-5">
            <div className="d-flex flex-wrap justify-content-between mb-5">
                <h4>Related Products</h4>
                <div><Link to={RoutePaths.shop} className="fd-btn fw-bold">View All <i className="bi bi-arrow-right"></i></Link></div>
            </div>
              <PopularProducts grid={4} />
        </div>
    </div>
  )
}

export default ProductDetails