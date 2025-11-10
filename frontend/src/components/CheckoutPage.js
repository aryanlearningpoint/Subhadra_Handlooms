import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function formatOrderId(orderNumber) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const prefix = `SH${yyyy}${mm}${dd}`; // SHYYYYMMDD
  const paddedNumber = String(orderNumber).padStart(6, "0"); // to make total 16 length
  return prefix + paddedNumber;
}

function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.address || !form.phone) {
    alert("⚠️ Please fill in all details before placing the order.");
    return;
  }

  const orderData = {
    recipient_name: form.name,
    recipient_phone: form.phone,
    shipping_address: form.address,
    cart: cart.map((item) => ({
      id: item.id,
      price: item.price,
      quantity: item.qty || 1,
    })),
  };

  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json(); // ✅ Only parse once
    console.log("Order API Response:", data);

    if (response.ok) {
      const formattedId = formatOrderId(data.order_id); // ✅ data.id is valid now
      localStorage.removeItem("cart");
      setCart([]);
      setForm({ name: "", address: "", phone: "" });

      navigate("/order-success", { state: { orderId: formattedId } }); // ✅ Send formatted ID
    } else {
      alert(`❌ Failed to place order: ${data.error || "Unknown error"}`);
    }

  } catch (error) {
    console.error("Network error:", error);
    alert("❌ Network error while placing order.");
  }
};


  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.qty || 1),
    0
  );

  return (
    <div style={styles.page}>
      {/* 🧡 Checkout Header */}
      <h2 style={styles.header}>🧺 Checkout</h2>

      <div style={styles.container}>
        {/* 🏠 Shipping Details Form */}
        <div style={styles.formContainer}>
          <h3 style={styles.subHeader}>Shipping Details</h3>

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              style={styles.input}
            />

            <label style={styles.label}>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="Enter your full address"
              style={{ ...styles.input, height: "80px", resize: "none" }}
            ></textarea>

            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
              style={styles.input}
            />

            <button type="submit" style={styles.button}>
              Place Order 🧡
            </button>
          </form>
        </div>

        {/* 🧾 Order Summary */}
        <div style={styles.summaryContainer}>
          <h3 style={styles.subHeader}>Order Summary</h3>

          <div>
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} style={styles.cartItem}>
                  <div>
                    <p style={styles.itemName}>
                      {item.name} × {item.qty || 1}
                    </p>
                  </div>
                  <p style={styles.itemPrice}>
                    ₹{(parseFloat(item.price) * (item.qty || 1)).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: "#777" }}>Your cart is empty.</p>
            )}
          </div>

          {cart.length > 0 && (
            <h3 style={styles.total}>
              Total:{" "}
              <span style={{ color: "#d35400" }}>₹{total.toFixed(2)}</span>
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}

/* 🎨 Style constants */
const styles = {
  page: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#fffaf6",
    minHeight: "100vh",
    padding: "2rem 1rem",
  },
  header: {
    textAlign: "center",
    color: "#d35400",
    fontWeight: "700",
    marginBottom: "2rem",
    fontSize: "1.8rem",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "2rem",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
  },
  subHeader: {
    color: "#d35400",
    fontWeight: "600",
    marginBottom: "1rem",
    fontSize: "1.2rem",
  },
  label: { fontWeight: "500", fontSize: "0.95rem" },
  input: {
    display: "block",
    width: "100%",
    padding: "0.7rem 1rem",
    borderRadius: "8px",
    border: "1px solid #f3c9a9",
    backgroundColor: "#fffaf6",
    marginBottom: "1rem",
    fontSize: "0.95rem",
    outline: "none",
  },
  button: {
    backgroundColor: "#d35400",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.9rem 1.5rem",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
  summaryContainer: {},
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #f2d7c4",
    padding: "0.5rem 0",
  },
  itemName: { margin: 0, fontWeight: "500", fontSize: "0.95rem" },
  itemPrice: { margin: 0, color: "#d35400", fontWeight: "500" },
  total: {
    textAlign: "right",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#333",
    marginTop: "1rem",
  },
};

/* 📱 Responsive media queries */
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@media (max-width: 768px) {
  div[style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
    gap: 1.5rem !important;
  }
}
`;
document.head.appendChild(styleSheet);

export default CheckoutPage;
