import React, { useState } from 'react';
import { useCreateReviewMutation } from '../store/apiquery/ReviewApiSlice'; // Import your products slice
import './reviewForm.css'

interface ReviewFormProps {
  userId: string;
  ProductId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ userId, ProductId}) => {
  const [createReview] = useCreateReviewMutation();

  const [formData, setFormData] = useState({
    productId: ProductId,
    rating: 0,
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createReview({ userId, review: formData });

      if ('data' in result && result.data) {
        console.log('Review submitted successfully');
        setFormData({ productId:ProductId,rating: 0, description: '' });
      } else if ('error' in result && result.error) {
        console.error('Review submission failed', result.error);
      }
    } catch (error) {
      console.error('Review submission failed', error);
    }
  };

  return (
    <div className="beautiful-card">
    <div className="card-header">
      <h3>Leave a Review</h3>
    </div>
    <div className="card-body">
      <form action="" method="post" className="checkout-service p-3 form-product" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value={0}>Select Rating</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Comment</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-submit">Submit Review</button>
      </form>
    </div>
  </div>
  );
};

export default ReviewForm;
