import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "https://subhadra-handlooms-backend.onrender.com";

function SareeList() {
  const [sarees, setSarees] = useState([]);

 useEffect(() => {
  fetch("https://subhadra-handlooms-backend.onrender.com/api/sarees/")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    })
    .then((data) => setSarees(data))
    .catch((err) => console.error("Error fetching sarees:", err));
}, []);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* 🪔 Hero Banner */}
      <section
        style={{
          backgroundImage: "url('/banner1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center",
          padding: "5rem 1rem",
          borderRadius: "10px",
          marginBottom: "3rem",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            position: "absolute",
            inset: 0,
            borderRadius: "10px",
          }}
        ></div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: "2.7rem", fontWeight: "700", color: "#fffaf5" }}>
            Subhadra Handlooms
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#ffe9d6" }}>
            Authentic Odisha Handlooms ✨
          </p>
        </div>
      </section>

      {/* 💎 Saree Grid */}
      <div id="collection" className="product-list">
        {sarees.map((saree) => (
          <div className="product-card" key={saree.id}>
            <Link to={`/saree/${saree.id}`}>
              <img
  src={
    saree.image
      ? saree.image.startsWith("http")
        ? saree.image
        : `${API_BASE_URL}${saree.image}`
      : "/banner.png"
  }
  alt={saree.name}
  className="product-image"
  loading="lazy"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/banner.png";
  }}
/>
            </Link>

            <h3>{saree.name}</h3>
            <p className="price">₹{saree.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SareeList;
