import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Utils/Generals";
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";

const token = getItem(RoutePaths.token);

export const productApiSlice = createApi({
  reducerPath: "api/products",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders(headers) {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products"],

  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "/products/search",
      providesTags: ["Products"],
    }),

    getProduct: builder.query({
      query: (id: string) => `/products/${id}`,
      providesTags: ["Products"],
    }),

    searchProduct: builder.query({
      query: (query: string) => `/product/search/${query}`,
      providesTags: ["Products"],
    }),

    getRandomProduct: builder.query({
      query: () => `/product/types/random`,
      providesTags: ["Products"],
    }),

    getBestProducts: builder.query({
      query: () => `/product/types/best-sellers`,
      providesTags: ["Products"],
    }),

    createProduct: builder.mutation({
      query: ({ formData }) => ({
        url: "/products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `/products/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (id: String) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    downloadProductReports: builder.query({
      query: () => "/products/reports",
      providesTags: ["Products"],
    }),

    uploadImages: builder.mutation({
      query: (file) => ({
        url: "/products/images",
        method: "POST",
        body: file,
      }),
      invalidatesTags: ["Products"],
    }),

    getRecommendations: builder.query({
      query: (getRecommendationsDto) => ({
        url: 'products/recommendations',
        method: 'POST',
        body: getRecommendationsDto,
      }),
    }),
      
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductQuery,
  useSearchProductQuery,
  useGetRandomProductQuery,
  useGetBestProductsQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useDownloadProductReportsQuery,
  useUploadImagesMutation,
  useGetRecommendationsQuery
} = productApiSlice;
