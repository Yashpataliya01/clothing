import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/categorie",
    }),
    getHeaders: builder.query({
      query: () => "/header",
    }),
    getTrendingProducts: builder.query({
      query: () => ({
        url: "/product",
        params: { tags: "Most Trending" },
      }),
    }),
    getProductsByCategory: builder.query({
      query: (categoryId) => ({
        url: "/product",
        params: { category: categoryId },
      }),
    }),
    getProducts: builder.query({
      query: (params) => ({
        url: "/product",
        params: {
          ...params,
          category: params.category || undefined,
          size: params.size || undefined,
          colors: params.colors || undefined,
          gender: params.gender || undefined,
          tags: params.tags || undefined,
          minPrice: params.minPrice || undefined,
          maxPrice: params.maxPrice || undefined,
          categoryName: params.categoryName || undefined,
        },
      }),
    }),
    getProduct: builder.query({
      query: (id) => `/product/${id}`,
    }),
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: "/cart/create",
        method: "POST",
        body: cartData,
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetHeadersQuery,
  useGetTrendingProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useAddToCartMutation,
} = apiSlice;
