import React from "react";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#fff4f0",
        textAlign: "center",
        padding: "1rem",
        fontFamily: "'Poppins', sans-serif",
        color: "#555",
        marginTop: "3rem",
        borderTop: "1px solid #f1d5c9",
      }}
    >
      <p style={{ margin: "0.3rem 0" }}>
        © {new Date().getFullYear()} <strong>Subhadra Handlooms</strong> — All
        Rights Reserved.
      </p>
      <p style={{ fontSize: "0.9rem" }}>
        Crafted with ❤️ in Odisha | Traditional & Handwoven Sarees
      </p>
    </footer>
  );
}

export default Footer;
