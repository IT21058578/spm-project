// import React, { useEffect } from 'react'


// const Reviews = ({rating} : {rating : number}) => {

//     let content = document.createElement('div');
//     const star = document.createElement('i');
//     star.classList.add('bi', 'bi-star-fill');

//     for (let i = 0; i < 5; i++) {
//         content.appendChild(star);
//     }


//     return (
//         <div className="products-reviews d-flex gap-2 text-warning">
//             <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
//         </div>
//     )

// }

// export default Reviews

import React from 'react';

const Reviews = ({ rating }: { rating: number }) => {
  // Calculate the number of filled stars (whole number part of the rating)
  const filledStars = Math.floor(rating);

  // Calculate the number of half-filled stars (if the rating is not an integer)
  const halfStar = rating - filledStars >= 0.5 ? 1 : 0;

  // Calculate the number of empty stars
  const emptyStars = 5 - filledStars - halfStar;

  // Create an array of star elements based on the calculated counts
  const starElements = [];

  for (let i = 0; i < filledStars; i++) {
    starElements.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
  }

  if (halfStar === 1) {
    starElements.push(<i key="half" className="bi bi-star-half text-warning"></i>);
  }

  for (let i = 0; i < emptyStars; i++) {
    starElements.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
  }

  return (
    <div className="products-reviews d-flex gap-2 text-warning">
      {starElements}
    </div>
  );
};

export default Reviews;
