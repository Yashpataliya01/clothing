import React from "react";
import { useGetCategoriesQuery } from "../../services/productsApi.js"; // Adjust path based on your project structure
import AutoScrollHeader from "./component/header/Header";
import ShopByCategory from "./component/shopBy/ShopBy";
import StatementHighlight from "./component/highlights/Highlights";
import NewArrivalsGrid from "./component/newArivals/NewArivals";

const Home = () => {
  const { data = [], isLoading, error } = useGetCategoriesQuery();
  const categories = [...data].reverse();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div>
      <AutoScrollHeader />
      <ShopByCategory categories={categories} />
      <StatementHighlight />
      {categories.length > 0 && (
        <>
          <NewArrivalsGrid products={categories[0]} />
          <NewArrivalsGrid products={categories[1]} />
          <NewArrivalsGrid products={categories[2]} />
        </>
      )}
    </div>
  );
};

export default Home;
