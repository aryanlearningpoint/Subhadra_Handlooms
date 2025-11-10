import React, { useEffect, useState } from "react";

function formatOrderId(orderNumber) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `SH${yyyy}${mm}${dd}${String(orderNumber).padStart(6, "0")}`;
}

function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username") || "";
  const token = localStorage.getItem("access_token") || "";

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.REACT_APP_API_BASE_URL}/my-orders/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          const refresh = localStorage.getItem("refresh_token");

          const refreshRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
          });

          const refreshData = await refreshRes.json();
          if (refreshRes.ok) {
            localStorage.setItem("access_token", refreshData.access);
            return window.location.reload();
          } else {
            setError("Session expired. Please login again.");
            localStorage.clear();
            return;
          }
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => setError("Network error while loading orders."));
  }, [token]);

  const toggleOrder = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.header}>Profile</h2>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Customer Info</h3>
          <p style={styles.text}><strong>Name:</strong> {username}</p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Order History</h3>

          {error && <p style={styles.error}>{error}</p>}

          {orders.length === 0 ? (
            <p style={styles.text}>No past orders found.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader} onClick={() => toggleOrder(order.id)}>
                  <span style={styles.text}>
  Order ID: {formatOrderId(order.id)} • {order.created_at} •  
<span style={{ color: order.status === "DELIVERED" ? "green" : "#d35400" }}>
  {order.status}
</span>
</span>
                  <span style={styles.chevron}>
                    {expandedOrder === order.id ? "▲" : "▼"}
                  </span>
                </div>

                {expandedOrder === order.id && (
                  <div style={styles.orderBody}>
                    <p style={styles.text}><strong>Deliver To:</strong> {order.recipient_name} ({order.recipient_phone})</p>
                    <p style={styles.text}><strong>Address:</strong> {order.shipping_address}</p>

                    <div style={styles.itemsList}>
                      {order.items.map((item, index) => (
                        <p key={index} style={styles.itemText}>
                          • {item.name} × {item.quantity} — ₹{item.price}
                          
                        </p>
                      ))}
                    </div>

                    <p style={styles.total}>Total Paid: ₹{order.total}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#fffaf6",
    minHeight: "100vh",
    padding: "2rem 1rem",
  },
  card: {
    maxWidth: "800px",
    backgroundColor: "#fff",
    margin: "0 auto",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  header: {
    color: "#d35400",
    fontWeight: "700",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  section: { marginBottom: "2rem" },
  sectionTitle: {
    color: "#d35400",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  text: { margin: "4px 0", fontSize: "0.95rem" },
  error: { color: "red" },

  /* Accordion styles */
  orderCard: {
    background: "#fff8f3",
    border: "1px solid #f3c9a9",
    borderRadius: "10px",
    marginBottom: "1rem",
    overflow: "hidden",
  },
  orderHeader: {
    padding: "1rem",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "600",
    color: "#d35400",
  },
  orderBody: { padding: "1rem", borderTop: "1px solid #f3c9a9" },
  orderTitle: { fontSize: "1rem" },
  chevron: { fontSize: "1rem" },

  itemsList: { marginTop: "0.5rem" },
  itemText: { margin: "3px 0" },

  total: {
    marginTop: "1rem",
    fontWeight: "600",
    color: "#d35400",
    textAlign: "right",
  },
};

export default ProfilePage;
