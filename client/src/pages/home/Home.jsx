import React, { useState, useEffect } from "react";
import AutoScrollHeader from "./component/header/Header";
import ShopByCategory from "./component/shopBy/ShopBy";
import StatementHighlight from "./component/highlights/Highlights";
import NewArrivalsGrid from "./component/newArivals/NewArivals";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const getDatabasedonCategory = async () => {
    const response = await fetch("http://localhost:5000/api/categorie");
    const data = await response.json();
    setCategories(data);
  };
  useEffect(() => {
    getDatabasedonCategory();
  }, []);
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
