import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LaporBarang from "./pages/LaporBarang";
import DaftarBarang from "./pages/DaftarBarang";
import AjukanKlaim from "./pages/AjukanKlaim";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/lapor-barang" element={<LaporBarang />} />
        <Route path="/daftar-barang" element={<DaftarBarang />} />
        <Route path="/ajukan-klaim" element={<AjukanKlaim />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
