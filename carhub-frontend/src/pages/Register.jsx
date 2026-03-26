import { useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const sendOtp = async () => {
    if (!name || !email || !password) {
      Swal.fire({ icon: "error", title: "Error", text: "Please fill name, email and password.", confirmButtonColor: "#6739b7", timer: 2000, showConfirmButton: false });
      return;
    }
    if (!validateEmail(email)) {
      Swal.fire({ icon: "error", title: "Error", text: "Enter valid email address.", confirmButtonColor: "#6739b7", timer: 2000, showConfirmButton: false });
      return;
    }
    try {
      const res = await API.post("/auth/send-otp", { name, email, password });
      Swal.fire({ icon: "info", title: "OTP Sent", text: res.data || "OTP sent to your email", confirmButtonColor: "#6739b7", timer: 2000, showConfirmButton: false });
      setShowOtp(true);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data || "Could not send OTP", confirmButtonColor: "#6739b7" });
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      Swal.fire({ icon: "error", title: "Error", text: "Enter OTP", confirmButtonColor: "#6739b7", timer: 2000, showConfirmButton: false });
      return;
    }
    try {
      const res = await API.post("/auth/verify-otp", { name, email, password, otp });
      Swal.fire({ icon: "success", title: "Success", text: res.data || "Registration Successful", confirmButtonColor: "#6739b7", timer: 2000, showConfirmButton: false }).then(() => { window.location.href = "/"; });
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Invalid OTP", text: err.response?.data || "OTP verification failed", confirmButtonColor: "#6739b7", timer: 2000, showConfirmButton: false });
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
          Create your account, verify with OTP, and unlock quick access to premium self-drive rides.
        </p>
      </div>
      <div className="auth-card auth-card-wide">
        <div className="auth-brand">
          <img src={logo} alt="CARHUB logo" onError={(e) => e.target.style.display = "none"} />
          <div style={{ fontWeight: 800, fontSize: 24 }}>CARHUB</div>
          <p style={{ margin: 2 }}>Secure signup with OTP verification</p>
        </div>

        <div className="auth-stack">
          {!showOtp && (
            <>
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
              <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              <button className="btn btn-gold" onClick={sendOtp}>Send OTP</button>
            </>
          )}

          {showOtp && (
            <>
              <input className="field" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
              <button className="btn btn-gold" onClick={verifyOtp}>Verify OTP</button>
            </>
          )}

          <button className="btn btn-secondary" onClick={() => (window.location.href = "/")}>Already have an account? Login</button>
        </div>
      </div>

      {showSuccess && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "grid", placeItems: "center", zIndex: 50 }}>
          <div className="card" style={{ maxWidth: 380, padding: 20, textAlign: "center", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 28, marginBottom: 10, fontWeight: 700 }}>OK</div>
            <h2 style={{ margin: "0 0 6px" }}>Registration Successful</h2>
            <p style={{ color: "var(--muted)", marginBottom: 16 }}>You can now login with your email and password.</p>
            <button className="btn btn-gold" onClick={() => window.location.href = "/"}>Go to Login</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
