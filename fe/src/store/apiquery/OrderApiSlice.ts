import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../Utils/Generals';
import { getItem } from '../../Utils/Generals';
import RoutePaths from '../../config';

const token = getItem(RoutePaths.token);

export const orderApiSlice = createApi({
    
    reducerPath : 'api/orders',
    baseQuery : fetchBaseQuery({baseUrl : BASE_URL ,
        prepareHeaders(headers) {
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
          },}),
    tagTypes : ['Order'],

    endpoints : (builder) => ({

        getAllOrder : builder.query(({
            query : () => '/Orders/search',
            providesTags : ['Order'],
            
        })),

        createOrder: builder.mutation({
            query : ({ userId,data,deliveryStatus,totalPrice}) => ({
                url : '/Orders',
                method : 'POST',
                user : userId,
                body : {data},
            }),
           invalidatesTags : ['Order']
        }),

        updateOrder: builder.mutation({
            query : ({data,token}) => ({
                url : '/Orders/edit',
                method : 'POST',
                body : {data},
            }),
            invalidatesTags : ['Order']
        }),

        updateOrderStatus: builder.mutation({
            query : ({id,deliveryStatus}) => ({
                url : `/Orders/${id}`,
                method : 'PUT',
                params: {deliveryStatus},
                
            }),
            invalidatesTags : ['Order']
        }),


        deleteOrder: builder.mutation({
            query : (id : string) => ({
                url : `/Orders/${id}`,
                
                method : 'DELETE'
            }),
            invalidatesTags : ['Order']
        })
        
    })
})


export const {
    useGetAllOrderQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useUpdateOrderStatusMutation,
    useDeleteOrderMutation,
 } = orderApiSlice;
