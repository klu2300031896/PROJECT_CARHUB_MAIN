import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="nav-brand" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={logo} alt="CARHUB" style={{ width: 34, height: 34, borderRadius: 8 }} onError={(e) => e.target.style.display='none'} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 0.5 }}>CARHUB</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Premium Car Rentals</div>
          </div>
        </div>

        <button className="nav-toggle" onClick={() => setOpen((prev) => !prev)} aria-label="Toggle navigation">
          ☰
        </button>

        <div className={`nav-menu ${open ? "open" : ""}`}>
          <button className="btn btn-secondary nav-magic-btn" onClick={() => { setOpen(false); navigate("/cars"); }}>Cars</button>
          <button className="btn btn-secondary nav-magic-btn" onClick={() => { setOpen(false); navigate("/bookings"); }}>My Bookings</button>
          {role === "ADMIN" && <button className="btn btn-secondary nav-magic-btn" onClick={() => { setOpen(false); navigate("/admin"); }}>Admin</button>}
          {role === "ADMIN" && <button className="btn btn-secondary nav-magic-btn" onClick={() => { setOpen(false); navigate("/admin/bookings"); }}>All Bookings</button>}
          <button className="btn btn-secondary nav-magic-btn" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
