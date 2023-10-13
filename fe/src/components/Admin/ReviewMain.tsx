import React, { useState, SyntheticEvent } from 'react'
import Swal from 'sweetalert2';
import Spinner from '../Spinner';
import { HandleResult } from '../HandleResult';
import { Review } from '../../types';
import { useUpdateProductMutation } from '../../store/apiquery/ReviewApiSlice';
import { useDeleteReviewMutation } from '../../store/apiquery/ReviewApiSlice';
import { useGetAllReviewQuery } from '../../store/apiquery/ReviewApiSlice';
import { ToastContainer, toast } from "react-toastify";


const UpdateReviews = ({Reviews}: {Reviews : Review}) => {

	const [updateData, setUpdateData] = useState(Reviews);
	const [updateReviews, udpateResult] = useUpdateProductMutation();

  const reviewID = Reviews._id;
  console.log("After:", reviewID);

  const [formData, setFormData] = useState({
    description: updateData.description,
    rating: updateData.rating,
  });

  const handleUpdateValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await updateReviews({reviewID,formData});

      if ('data' in result && result.data) {
        console.log('Review Updated successfully');
        toast.success("Review Updated successfully");
        setFormData({ description:'',rating:0});
      } else if ('error' in result && result.error) {
        console.error('Review Update failed', result.error);
        toast.error("Review Update failed");
      }
    } catch (error) {
      console.error('Review Update failed`', error);
      toast.error("Review Update failed");
    }
  };
  

	return (
		<form action="" method="patch" className="checkout-service p-3" onSubmit={handleSubmit}>
			<input type="hidden" name="_id" value={updateData._id} />
      <div>
          <label className='w-100'>
            <span>Rating</span>
            <input type="number" name="rating" value={formData.rating} className="form-control w-100 rounded-0 p-2" placeholder='Rating' onChange={handleUpdateValue}/>
          </label>
          <label className='w-100'>
            <span>Description</span>
            <input type="text" name="description" value={formData.description} className="form-control w-100 rounded-0 p-2" placeholder='Comment' onChange={handleUpdateValue}/>
          </label>
        </div>
        <div className="mt-4">
          <ToastContainer/>
        </div>
			<div className='mt-3'>{udpateResult.isLoading ?
				<button className="fd-btn w-25 text-center border-0"><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
					Loading...</button> :
				<button className="fd-btn w-25 text-center border-0" type='submit'>UPDATE Review</button>
			}</div>
		</form>
	)


}

const ListofReviews = ({ setReviews, setPage }: { setReviews: Function, setPage: Function }) => {

  const parseReviews = (Reviews: Review) => {
    setReviews(Reviews);
    setPage('add');
  }
  const { isLoading, data: ReviewsList, isSuccess, isError } = useGetAllReviewQuery('api/reviews');
  const [deleteReviews, deletedResult] = useDeleteReviewMutation();


  const deleteItem = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure to delete this Review ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((r) => {
      if (r.isConfirmed) {
        deleteReviews(id);
      }
    });
  }

  // search bar coding 
  const [searchInput, setSearchInput] = useState<string>('');

  let content: React.ReactNode;
  let count = 0;

    // Filter reviews based on the search input
  const filteredReviews = ReviewsList?.content.filter((review: Review) =>{
    const reviewDescription = review.description?.toLowerCase();
    const search = searchInput.toLowerCase();
  
    // Convert numbers to strings before searching
    const rating = review.rating?.toString();

    return (
      reviewDescription?.includes(search) ||
      rating?.includes(search) 
    );
  });

  content = isLoading || isError
    ? null
    : isSuccess
      ? filteredReviews.map((Reviews: Review) => {

        return (
          <tr className="p-3" key={Reviews._id}>
            <td scope="row w-25">{++count}</td>
            <td>{Reviews.productId}</td>
            <td>{Reviews.rating}</td>
            <td>{Reviews.description}</td>
            <td className='fw-bold d-flex gap-2 justify-content-center'>
              <a href="#" className='p-2 rounded-2 bg-secondary' onClick={(e) => parseReviews(Reviews)} title='Edit'><i className="bi bi-pen"></i></a>
              <a href="#" className='p-2 rounded-2 bg-danger' title='Delete' onClick={(e) => deleteItem(Reviews._id)}><i className="bi bi-trash"></i></a>
            </td>
          </tr>
        )
      })
      : null;

  return ( !isLoading ? 
  <div>
    {/* Add a search input field */}
    <div className="mb-3">
    <input
      type="text"
      placeholder="Search Review"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    />
  </div>
  <div className="table-responsive">
      <table className="table table-default text-center table-bordered">
        <thead>
          <tr className='fd-bg-primary text-white'>
            <th scope="col" className='p-3'>N°</th>
            <th scope="col" className='p-3'>PRODUCT ID</th>
            <th scope="col" className='p-3'>RATING</th>
            <th scope="col" className='p-3'>DESCRIPTION</th>
            <th scope="col" className='p-3'>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {
            content
          }
        </tbody>
      </table>
    </div>
    </div> : <Spinner />
  );
}

const ReviewMain = () => {
  const [page, setPage] = useState('list');
  const [currentReview, setCurrentReview] = useState(null);

  const changeToList = () => { setPage('add'); setCurrentReview(null) }
  const changeToAdd = () => { setPage('list'); }

  return (
    <div className='text-black'>
      <h4 className="fw-bold">REVIEWS</h4>
      <div className="add-product my-3 d-flex justify-content-end">
				{
					// page === 'list' ?
					// 	<a href="#" className="fd-btn bg-secondary w-25 text-center rounded-3" onClick={changeToList}>ORDER REPORS</a> :
						<a href="#" className="fd-btn bg-secondary w-25 text-center rounded-3" onClick={changeToAdd}>REVIEW LIST</a>
				}
			</div>
			<div className="subPartMain">
      {page === 'list' ? (
  <ListofReviews setReviews={setCurrentReview} setPage={setPage} />
    ) : currentReview ? ( // Check if currentOrder is not null
      <UpdateReviews Reviews={currentReview} />
    ) : null}
			</div>
    </div>
  )
}

export default ReviewMain;