import { useState } from "react";
import Swal from "sweetalert2";
import API from "../services/api";
import logo from "../assets/logo.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const getErrorText = (err, fallback) =>
    err?.response?.data?.message || err?.response?.data || fallback;

  const sendOtp = async () => {
    if (!email) {
      Swal.fire({ icon: "error", title: "Error", text: "Enter your email", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      Swal.fire({ icon: "success", title: "OTP Sent", text: "Check your email for the reset code", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
      setStep(2);
    } catch (err) {
      console.log("FORGOT PASSWORD ERROR:", err?.response);
      Swal.fire({ icon: "error", title: "Error", text: getErrorText(err, "Could not send OTP"), confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!otp || !password) {
      Swal.fire({ icon: "error", title: "Error", text: "Enter OTP and new password", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/reset-password", { email, otp, password });
      Swal.fire({ icon: "success", title: "Password Reset Successful", text: "You can now login with your new password", confirmButtonColor: "#6739b7" })
        .then(() => {
          window.location.href = "/";
        });
    } catch (err) {
      console.log("RESET PASSWORD ERROR:", err?.response);
      Swal.fire({ icon: "error", title: "Error", text: getErrorText(err, "Password reset failed"), confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
    } finally {
      setLoading(false);
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
          Recover your access securely and get back to booking your next self-drive journey.
        </p>
      </div>
      <div className="auth-card">
        <div className="auth-brand">
          <img src={logo} alt="CARHUB" onError={(e) => e.target.style.display = "none"} />
          <h1>Forgot Password</h1>
          <p style={{ margin: "8px 0 0" }}>
            {step === 1 ? "Enter your email to receive an OTP." : "Enter the OTP and choose a new password."}
          </p>
        </div>

        <div className="auth-stack">
          <input
            className="field"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={step === 2}
          />

          {step === 1 && (
            <button className="btn btn-gold" onClick={sendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          )}

          {step === 2 && (
            <>
              <input
                className="field"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <input
                className="field"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn btn-gold" onClick={resetPassword} disabled={loading}>
                {loading ? "Processing..." : "Reset Password"}
              </button>
              <p
                onClick={() => {
                  if (!loading) {
                    sendOtp();
                  }
                }}
                className={`auth-link${loading ? " disabled" : ""}`}
              >
                Resend OTP
              </p>
            </>
          )}

          <button className="btn btn-secondary" onClick={() => (window.location.href = "/")} disabled={loading}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
