import React from "react";

export default function ProductCard({ saree }) {
  return (
    <div className="product-card">
      {saree.image ? (
        <img
          src={saree.image}
          alt={saree.name}
          className="product-image"
        />
      ) : (
        <div className="no-image">No Image</div>
      )}
      <h3>{saree.name}</h3>
      <p>{saree.category}</p>
      <p className="price">₹{saree.price}</p>
      <p className="desc">{saree.description}</p>
    </div>
  );
}
