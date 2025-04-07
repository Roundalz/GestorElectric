import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

import CrudClientes from "./pages/Admin/CrudClientes";
import CrudPlanPagos from "./pages/Admin/CrudPlanPagos";
import CrudVendedores from "./pages/Admin/CrudVendedores";
import Logs from "./pages/Admin/Logs";

import Carrito from "./pages/Cliente/Carrito";
import Historial from "./pages/Cliente/Historial";
import Inicio from "./pages/Cliente/Inicio";
import PerfilCliente from "./pages/Cliente/Perfil";

import Dashboard from "./pages/Vendedor/Dashboard";
import Inventario from "./pages/Vendedor/Inventario";
import PerfilVendedor from "./pages/Vendedor/Perfil";
import Portal from "./pages/Vendedor/Portal";
import Ventas from "./pages/Vendedor/Ventas";

import Login from "./components/Login";
import "./App.css"; // Importamos los estilos globales
import Register from "./components/Register";

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <div className="content">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas de Admin */}
          <Route path="/admin/clientes" element={<CrudClientes />} />
          <Route path="/admin/plan-pagos" element={<CrudPlanPagos />} />
          <Route path="/admin/vendedores" element={<CrudVendedores />} />
          <Route path="/admin/logs" element={<Logs />} />

          {/* Rutas de Cliente */}
          <Route path="/cliente/carrito" element={<Carrito />} />
          <Route path="/cliente/historial" element={<Historial />} />
          <Route path="/cliente/inicio" element={<Inicio />} />
          <Route path="/cliente/perfil" element={<PerfilCliente />} />

          {/* Rutas de Vendedor */}
          <Route path="/vendedor/dashboard" element={<Dashboard />} />
          <Route path="/vendedor/inventario" element={<Inventario />} />
          <Route path="/vendedor/perfil" element={<PerfilVendedor />} />
          <Route path="/vendedor/portal" element={<Portal />} />
          <Route path="/vendedor/ventas" element={<Ventas />} />

          {/* Ruta para manejar páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
