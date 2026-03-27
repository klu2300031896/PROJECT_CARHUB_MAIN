import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../services/api";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.png";

function Cars() {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const name = localStorage.getItem("name");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
      return;
    }
    loadCars();
  }, [page]);

  const loadCars = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/cars?page=${page}&size=8`, { headers: { Authorization: `Bearer ${token}` } });
      setCars(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
  };

  const searchByDate = async () => {
    if (!startDate || !endDate) {
      Swal.fire({ icon: "error", title: "Error", text: "Please choose both start and end dates", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
      return;
    }
    try {
      const res = await API.get(`/cars/available?startDate=${startDate}&endDate=${endDate}`);
      setCars(res.data || []);
      setTotalPages(1);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || "Could not load available cars", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
    }
  };

  const searchFilters = async () => {
    try {
      const params = new URLSearchParams();
      if (brandSearch) params.append("brand", brandSearch);
      if (fuelFilter) params.append("fuelType", fuelFilter);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      const res = await API.get(`/cars/search?${params.toString()}`);
      setCars(res.data || []);
      setTotalPages(1);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || "Search failed", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
    }
  };

  const bookCar = async (carId) => {
    if (!startDate || !endDate) {
      Swal.fire({ icon: "error", title: "Error", text: "Pick start and end date before booking", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await API.post(`/user/book/${carId}?startDate=${startDate}&endDate=${endDate}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      Swal.fire({ icon: "success", title: "Success", text: "Booking successful", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
      loadCars();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || "Booking failed", confirmButtonColor: "#6739b7", timer: 2200, showConfirmButton: false });
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <Navbar />
      <div className="container">
        {name && <h1 className="page-heading" style={{ marginBottom: 12 }}>{`Welcome, "${name}"`}</h1>}
        <div className="section" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={logo} alt="CARHUB" style={{ width: 48, height: 48, borderRadius: 10 }} onError={(e) => e.target.style.display = "none"} />
              <div>
                <h1 className="page-heading" style={{ margin: 0 }}>Available Premium Cars</h1>
                <p className="subtitle" style={{ margin: 0 }}>Search by date and filter by brand, fuel, and price in one place.</p>
              </div>
            </div>
            <button className="btn btn-gold" onClick={loadCars}>Refresh</button>
          </div>

          <div className="grid grid-2" style={{ gap: 10, marginTop: 10 }}>
            <div className="section">
              <h3 style={{ marginTop: 0 }}>Date Search</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input className="field" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input className="field" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button className="btn btn-gold" onClick={searchByDate}>Search</button>
              </div>
            </div>

            <div className="section">
              <h3 style={{ marginTop: 0 }}>Advanced Filters</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <input className="field" placeholder="Brand or Model" value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} />
                <select className="field" value={fuelFilter} onChange={(e) => setFuelFilter(e.target.value)}>
                  <option value="">Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                </select>
                <input className="field" type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <input className="field" type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
              <button className="btn btn-gold" style={{ marginTop: 10 }} onClick={searchFilters}>Apply Filters</button>
            </div>
          </div>
        </div>

        {cars.length === 0 ? (
          <div className="section card">No cars available yet. Use filters to find cars.</div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginBottom: 16 }}>
            {cars.map((car) => (
              <div key={car.id} className="card" style={{ padding: 12 }}>
                <div style={{ height: 160, overflow: "hidden", borderRadius: 8, marginBottom: 10 }}>
                  <img src={car.imageUrl ? `https://project-carhub-main.onrender.com${car.imageUrl}` : "https://via.placeholder.com/400x200?text=No+Image"} alt="car" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h3 style={{ margin: "0 0 6px" }}>{car.brand} {car.model}</h3>
                <p style={{ margin: "0 0 6px", color: "var(--muted)" }}>ID: {car.id}</p>
                <p style={{ margin: "0 0 6px", color: "var(--muted)" }}>Fuel: {car.fuelType || "N/A"}</p>
                <p style={{ margin: "0 0 8px", fontWeight: 700, color: "var(--gold)" }}>Rs. {car.pricePerDay}/day</p>
                <p style={{ margin: 0, color: car.available ? "var(--success)" : "var(--warning)" }}>Status: {car.available ? "Available" : "Booked"}</p>
                <button className="btn btn-gold" style={{ width: "100%", marginTop: 10 }} disabled={!car.available} onClick={() => bookCar(car.id)}>Book Now</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
          <button className="btn btn-secondary" onClick={() => setPage((prev) => prev - 1)} disabled={page === 0}>
            Prev
          </button>
          <span>Page {page + 1}</span>
          <button className="btn btn-secondary" onClick={() => setPage((prev) => prev + 1)} disabled={page + 1 >= totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cars;
