import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const getStatusStyles = (status) => {
    switch (status) {
      case "CONFIRMED":
        return {
          backgroundColor: "rgba(15, 157, 88, 0.12)",
          color: "var(--success)",
          border: "1px solid rgba(15, 157, 88, 0.28)"
        };
      case "CANCELLED":
        return {
          backgroundColor: "rgba(220, 38, 38, 0.1)",
          color: "var(--danger)",
          border: "1px solid rgba(220, 38, 38, 0.22)"
        };
      case "COMPLETED":
        return {
          backgroundColor: "rgba(103, 57, 183, 0.1)",
          color: "var(--muted)",
          border: "1px solid rgba(103, 57, 183, 0.2)"
        };
      default:
        return {
          backgroundColor: "rgba(103, 57, 183, 0.12)",
          color: "var(--gold)",
          border: "1px solid rgba(103, 57, 183, 0.22)"
        };
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN") {
      window.location.href = "/cars";
      return;
    }

    API.get("/admin/bookings", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setBookings(res.data))
      .catch((err) => {
        console.error(err);
        Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || "Could not load bookings", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
      });
  }, [token]);

  const filteredBookings = bookings.filter((booking) => {
    const bookingStart = booking.startDate;
    const bookingEnd = booking.endDate;

    if (searchStartDate && bookingEnd < searchStartDate) {
      return false;
    }

    if (searchEndDate && bookingStart > searchEndDate) {
      return false;
    }

    return true;
  });

  const confirmedBookings = filteredBookings.filter((booking) => booking.status === "CONFIRMED");
  const cancelledBookings = filteredBookings.filter((booking) => booking.status === "CANCELLED");
  const completedBookings = filteredBookings.filter((booking) => booking.status === "COMPLETED");

  const renderBookingCard = (b) => (
    <div key={b.id} className="card" style={{ padding: 14 }}>
      <div style={{ height: 160, overflow: "hidden", borderRadius: 10, marginBottom: 12 }}>
        <img
          src={b.car.imageUrl ? `https://project-carhub-main.onrender.com${b.car.imageUrl}` : "https://via.placeholder.com/400x220?text=No+Image"}
          alt={`${b.car.brand} ${b.car.model}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>{b.car.brand} {b.car.model}</h3>
        <span style={{ color: "var(--gold)" }}>{b.userEmail}</span>
      </div>
      <p style={{ color: "var(--muted)", margin: "3px 0" }}>Car ID: {b.car?.id}</p>
      <p style={{ color: "var(--muted)", margin: "3px 0" }}>Start: {b.startDate}</p>
      <p style={{ color: "var(--muted)", margin: "3px 0" }}>End: {b.endDate}</p>
      <p style={{ color: "var(--gold)", margin: "6px 0 0", fontWeight: 700 }}>Total: Rs. {b.totalPrice}</p>
      <div style={{ marginTop: 10 }}>
        <span
          style={{
            ...getStatusStyles(b.status),
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.4
          }}
        >
          {b.status}
        </span>
      </div>
    </div>
  );

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <Navbar />
      <div className="container">
        {name && <h1 className="page-heading" style={{ marginBottom: 12 }}>{`Welcome, "${name}"`}</h1>}
        <div className="section" style={{ marginBottom: 12 }}>
          <h1 className="page-heading">All Bookings</h1>
          <p className="subtitle">View all bookings and manage status in one place.</p>
        </div>
        <div className="section" style={{ marginBottom: 16 }}>
          <h3 style={{ marginTop: 0 }}>Search By Date</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input className="field" type="date" value={searchStartDate} onChange={(e) => setSearchStartDate(e.target.value)} />
            <input className="field" type="date" value={searchEndDate} onChange={(e) => setSearchEndDate(e.target.value)} />
            <button className="btn btn-secondary" onClick={() => { setSearchStartDate(""); setSearchEndDate(""); }}>
              Clear
            </button>
          </div>
        </div>
        {filteredBookings.length === 0 ? (
          <div className="card" style={{ padding: 16 }}>
            {bookings.length === 0 ? "No bookings yet." : "No bookings found for the selected dates."}
          </div>
        ) : (
          <>
            <div className="section" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ margin: 0, color: "var(--success)" }}>Confirmed Bookings</h2>
                <span style={{ color: "var(--muted)" }}>{confirmedBookings.length}</span>
              </div>
              {confirmedBookings.length === 0 ? (
                <div className="card" style={{ padding: 16 }}>No confirmed bookings.</div>
              ) : (
                <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
                  {confirmedBookings.map(renderBookingCard)}
                </div>
              )}
            </div>

            <div className="section" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ margin: 0, color: "var(--danger)" }}>Cancelled Bookings</h2>
                <span style={{ color: "var(--muted)" }}>{cancelledBookings.length}</span>
              </div>
              {cancelledBookings.length === 0 ? (
                <div className="card" style={{ padding: 16 }}>No cancelled bookings.</div>
              ) : (
                <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
                  {cancelledBookings.map(renderBookingCard)}
                </div>
              )}
            </div>

            <div className="section">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ margin: 0, color: "var(--gold)" }}>Completed Bookings</h2>
                <span style={{ color: "var(--muted)" }}>{completedBookings.length}</span>
              </div>
              {completedBookings.length === 0 ? (
                <div className="card" style={{ padding: 16 }}>No completed bookings.</div>
              ) : (
                <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
                  {completedBookings.map(renderBookingCard)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminBookings;
