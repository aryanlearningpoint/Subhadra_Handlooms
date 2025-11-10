import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(items);
  }, []);

  const updateLocalStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty: (item.qty || 1) + 1 } : item
    );
    updateLocalStorage(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 0 }
          : item
      )
      .filter((item) => item.qty > 0);
    updateLocalStorage(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    updateLocalStorage(updated);
  };

  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.qty || 1),
    0
  );

  if (cart.length === 0) {
    return (
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          textAlign: "center",
          padding: "3rem 1rem",
          color: "#555",
        }}
      >
        <h2>🛍️ Your Cart</h2>
        <p>Your cart is empty.</p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            backgroundColor: "#d35400",
            color: "#fff",
            padding: "0.8rem 1.8rem",
            borderRadius: "25px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        maxWidth: "800px",
        margin: "2rem auto",
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "2rem",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "1.8rem",
          fontWeight: "700",
          marginBottom: "1.5rem",
          color: "#d35400",
        }}
      >
        🧺 Your Cart
      </h2>

      {cart.map((item) => (
  <div
    key={item.id}
    style={{
      display: "grid",
      gridTemplateColumns: "auto 1fr auto auto",
      alignItems: "center",
      gap: "1.2rem",
      paddingBottom: "1rem",
      marginBottom: "1.2rem",
      borderBottom: "1px solid #f3c9a9",
    }}
  >
    {/* Image */}
    <img
      src={item.image}
      alt={item.name}
      style={{
        width: "80px",
        height: "80px",
        objectFit: "cover",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    />

    {/* Name and price */}
    <div style={{ lineHeight: "1.4" }}>
      <h3
        style={{
          margin: 0,
          fontWeight: "600",
          fontSize: "1rem",
        }}
      >
        {item.name}
      </h3>
      <p
        style={{
          color: "#d35400",
          fontWeight: "500",
          fontSize: "0.95rem",
          marginTop: "0.3rem",
        }}
      >
        ₹{item.price}
      </p>
    </div>

    {/* Quantity controls */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff8f3",
        border: "1px solid #f3c9a9",
        borderRadius: "50px",
        padding: "0.3rem 0.6rem",
        boxShadow: "0 3px 6px rgba(0,0,0,0.05)",
        minWidth: "95px",
      }}
    >
      <button
        onClick={() => decreaseQty(item.id)}
        style={{
          backgroundColor: "#fbe6d0",
          color: "#d35400",
          border: "none",
          borderRadius: "50%",
          width: "28px",
          height: "28px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        −
      </button>

      <span
        style={{
          fontWeight: "600",
          fontSize: "1rem",
          color: "#333",
          width: "30px",
          textAlign: "center",
        }}
      >
        {item.qty || 1}
      </span>

      <button
        onClick={() => increaseQty(item.id)}
        style={{
          backgroundColor: "#fbe6d0",
          color: "#d35400",
          border: "none",
          borderRadius: "50%",
          width: "28px",
          height: "28px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        +
      </button>
    </div>

    {/* Remove button */}
    <button
      onClick={() => removeItem(item.id)}
      style={{
        backgroundColor: "transparent",
        color: "#c0392b",
        border: "none",
        fontSize: "1.2rem",
        cursor: "pointer",
      }}
      title="Remove item"
    >
      ✕
    </button>
  </div>
))}


      <div
        style={{
          borderTop: "2px solid #f3c9a9",
          paddingTop: "1rem",
          textAlign: "right",
          fontWeight: "600",
          fontSize: "1.2rem",
          color: "#333",
        }}
      >
        Total: ₹{total.toFixed(2)}
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link
          to="/checkout"
          style={{
            backgroundColor: "#d35400",
            color: "#fff",
            padding: "0.9rem 2rem",
            borderRadius: "25px",
            textDecoration: "none",
            fontWeight: "600",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "#b84300")
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "#d35400")
          }
        >
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
}

export default CartPage;
