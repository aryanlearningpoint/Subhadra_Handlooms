import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function SareeDetail() {
  const { id } = useParams();
  const [saree, setSaree] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    fetch(`${BASE_URL}/sarees/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setSaree(data);
        setMainImage(data.image); // Default main image
      })
      .catch((err) => console.error("Error fetching saree:", err));
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === saree.id);

    let updatedCart;
    if (existing) {
      updatedCart = cart.map((item) =>
        item.id === saree.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...saree, qty: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
    alert(`${saree.name} added to cart!`);
  };

  if (!saree) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="grid md:grid-cols-2 gap-8">

        {/* Main Image with Zoom */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img
            src={mainImage}
            alt={saree.name}
            className="rounded-lg shadow-md"
            style={{
              width: "100%",
              maxHeight: "480px",
              objectFit: "cover",
              transition: "transform 0.3s",
              cursor: "zoom-in",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.45)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          />

          {/* Thumbnail Gallery */}
          <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
            {/* Main Image Thumb */}
            <img
              src={saree.image}
              alt="Main Thumb"
              onClick={() => setMainImage(saree.image)}
              style={thumbStyle(mainImage === saree.image)}
            />

            {/* Extra Images */}
            {saree.gallery?.map((imgObj, index) => (
              <img
                key={index}
                src={imgObj.image}
                alt={`Thumbnail ${index}`}
                onClick={() => setMainImage(imgObj.image)}
                style={thumbStyle(mainImage === imgObj.image)}
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#d35400" }}>
            {saree.name}
          </h2>

          <p style={{ marginTop: "12px", color: "#555", lineHeight: "1.6" }}>
            {saree.description || "Handloom saree crafted with perfection."}
          </p>

          <p style={{ marginTop: "18px", fontSize: "1.4rem", color: "#d35400", fontWeight: "600" }}>
            ₹{saree.price}
          </p>

          <button
            onClick={addToCart}
            style={{
              marginTop: "1.5rem",
              backgroundColor: "#d35400",
              color: "#fff",
              padding: "0.8rem 1.6rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Add to Cart 🛒
          </button>

          <div style={{ marginTop: "1.5rem" }}>
            <Link to="/" style={{ color: "#d35400", textDecoration: "none", fontWeight: "500" }}>
              ← Back to Sarees
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const thumbStyle = (isActive) => ({
  width: "75px",
  height: "75px",
  objectFit: "cover",
  borderRadius: "6px",
  cursor: "pointer",
  border: isActive ? "3px solid #d35400" : "1px solid #ccc",
  transition: "0.25s",
});

export default SareeDetail;
