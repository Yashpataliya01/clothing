import React from "react";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "../../services/productsApi.js";
import AutoScrollHeader from "./component/header/Header";
import ShopByCategory from "./component/shopBy/ShopBy";
import StatementHighlight from "./component/highlights/Highlights";
import NewArrivalsGrid from "./component/newArivals/NewArivals";

const Home = () => {
  const {
    data: categoriesData = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();
  // Select the last three categories
  const lastThreeCategories = categoriesData.slice(-3);

  // Fetch products for each of the last three categories
  const productQueries = lastThreeCategories.map((category) => ({
    category: category.name,
    limit: 10, // Adjust limit as needed
  }));

  const productResults = productQueries.map((query, index) =>
    useGetProductsQuery({
      ...query,
      page: 1,
    })
  );

  if (categoriesLoading) return <div>Loading...</div>;
  if (categoriesError) return <div>Error loading categories</div>;

  return (
    <div>
      <AutoScrollHeader />
      <ShopByCategory categories={categoriesData} />
      <StatementHighlight />
      {lastThreeCategories.length > 0 && (
        <>
          {lastThreeCategories.map((category, index) => {
            const {
              data: productData,
              isLoading: productsLoading,
              isError: productsError,
            } = productResults[index];
            const products = productData?.products || [];

            return (
              <div key={category._id || index}>
                {productsLoading ? (
                  <div>Loading products for {category.name}...</div>
                ) : productsError ? (
                  <div>Error loading products for {category.name}</div>
                ) : (
                  <NewArrivalsGrid
                    products={products}
                    categoryName={category.name} // Optional: pass category name for display
                  />
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Home;
