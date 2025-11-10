import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", username: "" });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const url = isLogin
      ? `${BASE_URL}/login/`                 // ✅ Login using Phone/Email
      : `${BASE_URL}/register/`;       // ✅ Signup Save

    const payload = isLogin
      ? { username: form.username, password: form.password } // username = phone or email
      : { name: form.name, phone: form.phone, email: form.email, password: form.password };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      if (isLogin) {
        // ✅ Store login tokens + name
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("username", data.username);   // first_name from backend

        setMessage("✅ Login successful!");

        // ✅ Update Navbar instantly
        window.dispatchEvent(new Event("storage"));

        // ✅ Redirect
        setTimeout(() => navigate("/"), 500);

      } else {
        setMessage("🎉 Account created successfully! Please login now.");
        setIsLogin(true);
      }
    } else {
      setMessage(data.error || "❌ Something went wrong.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.header}>{isLogin ? "Login" : "Sign Up"}</h2>

        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* ✅ SIGNUP FIELDS */}
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </>
          )}

          {/* ✅ LOGIN FIELD (Email or Phone) */}
          {isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Email or Phone"
              value={form.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          )}

          {/* ✅ PASSWORD FIELD (shared) */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button
  type="submit"
  style={styles.button}
  onMouseOver={(e) => (e.target.style.opacity = "0.9")}
  onMouseOut={(e) => (e.target.style.opacity = "1")}
>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p style={styles.switchText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            style={styles.link}
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? "Sign up here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #fff3e6, #ffe9d6)",
    minHeight: "calc(100vh - 80px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 0",
  },

  card: {
    backdropFilter: "blur(14px)",
    background: "rgba(255, 255, 255, 0.55)",
    borderRadius: "20px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    textAlign: "center",
  },

  header: {
    color: "#c24600",
    fontWeight: "600",
    marginBottom: "1.5rem",
    fontSize: "1.6rem",
  },

  input: {
  width: "100%",
  padding: "0.85rem",
  marginBottom: "1.1rem",
  borderRadius: "10px",
  border: "1px solid #e8c7a9",
  backgroundColor: "rgba(255,255,255,0.7)",
  outline: "none",
  transition: "0.2s",
  boxSizing: "border-box",   // ✅ ensures size matches button
},

button: {
  width: "100%",              // ✅ same width as input
  padding: "0.9rem",
  borderRadius: "10px",
  border: "none",
  fontWeight: "600",
  background: "linear-gradient(135deg, #e06d1d, #c24600)",
  color: "#fff",
  cursor: "pointer",
  display: "block",           // ✅ prevents shrinking
  boxSizing: "border-box",    // ✅ ensures width matches input
  marginTop: "0.5rem",
},

  buttonHover: {
    background: "linear-gradient(135deg, #ff8c3e, #d95d00)",
  },

  switchText: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#444",
  },

  link: {
    color: "#c24600",
    fontWeight: "600",
    cursor: "pointer",
  },

  message: {
    fontSize: "0.9rem",
    marginBottom: "1rem",
    color: "#b54600",
  },
};


export default AuthPage;
