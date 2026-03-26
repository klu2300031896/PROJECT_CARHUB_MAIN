import { useState } from "react";
import Swal from "sweetalert2";
import API from "../services/api";
import logo from "../assets/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name || email.split("@")[0]);
      if (res.data.role === "ADMIN") window.location.href = "/admin";
      else window.location.href = "/cars";
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data || "Login failed", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
    }
  };

  return (
    <div className="auth-page">
      <div className="login-hero">
        <div className="login-hero-badge">
          <img src={logo} alt="CARHUB" onError={(e) => e.target.style.display = "none"} />
          <span>CARHUB</span>
        </div>
        <h1 className="login-hero-title">SELF DRIVE CARS FOR RENTAL</h1>
        <p className="login-hero-subtitle">
          Premium vehicles, flexible booking, and a smoother self-drive experience for every trip.
        </p>
      </div>
      <div className="auth-card">
        <div className="auth-brand">
          <img src={logo} alt="CARHUB" onError={(e) => e.target.style.display = 'none'} />
          <h1>CARHUB</h1>
          <p>Premium Car Rentals</p>
          <p style={{ marginTop: 10, color: "var(--text)", fontWeight: 600 }}>Login to continue</p>
        </div>

        <div className="auth-stack">
          <input className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn btn-gold" style={{ width: "100%", marginTop: 10 }} onClick={login}>Login</button>
          <p className="auth-link" onClick={() => (window.location.href = "/forgot-password")}>Forgot Password?</p>
          <button className="btn btn-secondary" style={{ width: "100%", marginTop: 8 }} onClick={() => (window.location.href = "/register")}>Create Account</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
