import React, { useEffect, useState } from "react";
import { getSarees } from "../api";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const [sarees, setSarees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSarees();
        setSarees(data);
      } catch (error) {
        console.error("Error fetching sarees:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="product-list">
      {sarees.map((saree) => (
        <ProductCard key={saree.id} saree={saree} />
      ))}
    </div>
  );
}
