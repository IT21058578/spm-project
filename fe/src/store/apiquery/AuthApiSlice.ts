import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../Utils/Generals';
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";

const token = getItem(RoutePaths.token);


export const authApiSlice = createApi({
    
    reducerPath : 'api/auth',
    baseQuery : fetchBaseQuery({baseUrl : BASE_URL ,
        prepareHeaders(headers) {
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
          },}),
    tagTypes : ['Auth'],

    endpoints : (builder) => ({

        refresh : builder.query(({
            query : () => '/auth/authorize',
            providesTags : ['Auth']
        })),

        login: builder.mutation({
            query : (category) => ({
                url : `/auth/login`,
                method : 'POST',
                body : category,
            }),
           invalidatesTags : ['Auth']
        }),

        register: builder.mutation({
            query : (userDto) => ({
                url : '/auth/register',
                method : 'POST',
                body : userDto,
            }),
            invalidatesTags : ['Auth']
        })
    })
})


export const {
    useRefreshQuery,
    useLoginMutation,
    useRegisterMutation
 } = authApiSlice;
