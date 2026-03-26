import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../services/api";
import Navbar from "../components/Navbar";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  useEffect(() => {
    API.get("/user/bookings", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || "Could not load bookings", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
      });
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      await API.put(`/user/cancel/${bookingId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      Swal.fire({ icon: "success", title: "Success", text: "Booking Cancelled", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
      window.location.reload();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Cancel Failed", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
    }
  };

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

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <Navbar />
      <div className="container" style={{ paddingTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            {name && <h1 className="page-heading" style={{ margin: "0 0 8px" }}>{`Welcome, "${name}"`}</h1>}
            <h1>My Bookings</h1>
            <p style={{ color: "var(--muted)" }}>Track your rentals and manage cancellations</p>
          </div>
        </div>
        <div className="section" style={{ marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>Search By Date</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input className="field" type="date" value={searchStartDate} onChange={(e) => setSearchStartDate(e.target.value)} />
            <input className="field" type="date" value={searchEndDate} onChange={(e) => setSearchEndDate(e.target.value)} />
            <button className="btn btn-secondary" onClick={() => { setSearchStartDate(""); setSearchEndDate(""); }}>
              Clear
            </button>
          </div>
        </div>
        <div className="grid grid-2" style={{ gap: 12 }}>
          {filteredBookings.length === 0 && (
            <div className="card" style={{ padding: 16 }}>
              {bookings.length === 0 ? "No bookings yet." : "No bookings found for the selected dates."}
            </div>
          )}
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="card" style={{ border: "1px solid var(--border)", padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <h3>{booking.car.brand} {booking.car.model}</h3>
                <span style={{ color: booking.status === "CONFIRMED" ? "var(--success)" : booking.status === "COMPLETED" ? "var(--muted)" : "var(--warning)" }}>{booking.status}</span>
              </div>
              <p style={{ color: "var(--muted)", marginBottom: 4 }}>Car ID: {booking.car?.id}</p>
              <p style={{ color: "var(--muted)", marginBottom: 4 }}>Start: {booking.startDate}</p>
              <p style={{ color: "var(--muted)", marginBottom: 4 }}>End: {booking.endDate}</p>
              <p style={{ color: "var(--gold)", fontWeight: 700 }}>Total: Rs. {booking.totalPrice}</p>
              {booking.status === "CONFIRMED" && <button className="btn btn-gold" style={{ marginTop: 8 }} onClick={() => cancelBooking(booking.id)}>Cancel Booking</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
