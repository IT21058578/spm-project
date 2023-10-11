import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../Utils/Generals';


export const authApiSlice = createApi({
    
    reducerPath : 'api/auth',
    baseQuery : fetchBaseQuery({baseUrl : BASE_URL}),
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
            query : (data) => ({
                url : '/auth/register',
                method : 'POST',
                body : data,
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
