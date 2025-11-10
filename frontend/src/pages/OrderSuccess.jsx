import { useLocation, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { state } = useLocation();
  const orderId = state?.orderId; // ✅ get passed order id

  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <h2>🎉 Order Placed Successfully!</h2>

      <p>Your Order ID:</p>
      <h3 style={{ color: "#d35400", fontSize: "1.4rem" }}>{orderId}</h3> {/* ✅ Show formatted ID */}

      <Link to="/profile" style={{ color: "#d35400", fontWeight: 600 }}>
        View Order Details →
      </Link>
      <p>Status: <b style={{ color: "#d35400" }}>Pending</b></p>

    </div>
  );
}
