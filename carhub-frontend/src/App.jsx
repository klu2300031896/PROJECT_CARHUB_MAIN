import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Cars from "./pages/Cars";
import MyBookings from "./pages/Bookings";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import Register from "./pages/Register";  
import AdminBookings from "./pages/AdminBookings";
import ForgotPassword from "./pages/ForgotPassword";

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
        <Route path="/cars" element={<ProtectedRoute><Cars /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
