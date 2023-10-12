import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../Utils/Generals';
import { getItem } from '../../Utils/Generals';
import RoutePaths from '../../config';

const token = getItem(RoutePaths.token);

export const usersApiSlice = createApi({
    
    reducerPath : 'api/users',
    baseQuery : fetchBaseQuery({baseUrl : BASE_URL ,
        prepareHeaders(headers) {
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
          },}),
    tagTypes : ['Users'],

    endpoints : (builder) => ({

        getAllUsers : builder.query(({
            query : () => '/users/search',
            providesTags : ['Users'],
        })),

        getUser : builder.query({
            query : (id) => `/users/${id}`,
            providesTags : ['Users']
        }),

        getStartistics: builder.query({
            query: () => '/statistics',
        }),

        createUser: builder.mutation({
            query : (user) => ({
                url : `/user/create`,
                method : 'POST',
                body : user,
            }),
           invalidatesTags : ['Users']
        }),

        updateUser: builder.mutation({
            query : (data) => ({
                url : '/user/edit',
                method : 'POST',
                body : {_method : 'patch', ...data},
            }),
            invalidatesTags : ['Users']
        }),

        deleteUser: builder.mutation({
            query : (id : String) => ({
                url : `/users/${id}`,
                method : 'DELETE',
            }),
            invalidatesTags : ['Users']
        })
    })
})


export const {
    useGetAllUsersQuery,
    useGetUserQuery,
    useUpdateUserMutation,
    useCreateUserMutation,
    useDeleteUserMutation,
    useGetStartisticsQuery
 } = usersApiSlice;
