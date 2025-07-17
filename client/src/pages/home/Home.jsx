import React from "react";
import { useGetCategoriesQuery } from "../../services/productsApi.js";
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

  const topCategories = categoriesData.slice(0, 3);

  return (
    <div>
      <AutoScrollHeader />
      <ShopByCategory categories={categoriesData} />
      <StatementHighlight />
      {topCategories.length > 0 &&
        topCategories.map((category, index) => (
          <div key={category._id || index}>
            <NewArrivalsGrid products={category} categoryName={category.name} />
          </div>
        ))}
    </div>
  );
};

export default Home;
