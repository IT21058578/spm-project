import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../Utils/Generals';
import { getItem } from '../../Utils/Generals';
import RoutePaths from '../../config';

const token = getItem(RoutePaths.token);


export const reviewApiSlice = createApi({
    
    reducerPath : 'api/reviews',
    baseQuery : fetchBaseQuery({baseUrl : BASE_URL ,
        prepareHeaders(headers) {
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
          },}),
    tagTypes : ['Review'],

    endpoints : (builder) => ({

        getAllReview : builder.query(({
            query : () => '/reviews/search',
            providesTags : ['Review']
        })),

        createReview: builder.mutation({
            query : ({userId,review}) => ({
                url : '/reviews',
                method : 'POST',
                user: userId,
                body : review,
            }),
           invalidatesTags : ['Review']
        }),

        downloadReviewsReports: builder.query(({
            query : () => '/reviews/'
        })),

        deleteReview: builder.mutation({
            query: (reviewId: String) => ({
              url: `/reviews/${reviewId}`,
              method: "DELETE",
            }),
            invalidatesTags: ["Review"],
        }),

        updateProduct: builder.mutation({
            query: ({ reviewID, formData }) => ({
              url: `/reviews/${reviewID}`,
              method: "PUT",
              body: formData,
            }),
            invalidatesTags: ["Review"],
          }),

    })
})


export const {
    useGetAllReviewQuery,
    useCreateReviewMutation,
    useDeleteReviewMutation,
    useUpdateProductMutation
 } = reviewApiSlice;
