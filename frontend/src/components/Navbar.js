import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => {
      const token = localStorage.getItem("access_token");
      const storedUser = localStorage.getItem("username");
      setUsername(token && storedUser ? storedUser : null);
    };

    updateUser();
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUsername(null);
    navigate("/auth");
  };

  const isLoggedIn = !!username;

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <Link to="/" style={styles.logoText}>
          Subhadra Handlooms
        </Link>
      </div>

      <nav style={styles.navLinks}>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/cart" style={styles.navLink}>🛍️ Cart</Link>

        {/* ✅ Show My Profile only if logged in */}
        {isLoggedIn && (
          <Link to="/profile" style={styles.navLink}>My Profile</Link>
        )}

        {/* ✅ Login / Logout Section */}
        {!isLoggedIn ? (
          <Link to="/auth" style={styles.navLink}>👤 Login</Link>
        ) : (
          <div style={styles.userSection}>
            <span style={styles.username}>👤 {username}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    fontFamily: "'Poppins', sans-serif",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logoText: {
    color: "#d35400",
    fontWeight: "700",
    fontSize: "1.5rem",
    textDecoration: "none",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  navLink: {
    color: "#d35400",
    fontWeight: "600",
    textDecoration: "none",
    fontSize: "0.95rem",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
  },
  username: {
    color: "#333",
    fontWeight: "500",
  },
  logoutBtn: {
    backgroundColor: "#d35400",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.45rem 0.9rem",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
};

export default Navbar;
