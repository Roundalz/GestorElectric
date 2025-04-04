import { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css"; // Agregar estilos si es necesario

function NavBar() {
  const [rol, setRol] = useState("admin"); // Opciones: 'admin', 'cliente', 'vendedor'

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">GestorElectric</Link>
      
      <select onChange={(e) => setRol(e.target.value)} value={rol} className="role-select">
        <option value="admin">Admin</option>
        <option value="cliente">Cliente</option>
        <option value="vendedor">Vendedor</option>
      </select>

      <ul className="nav-links">
        {rol === "admin" && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/admin/clientes">Clientes</Link></li>
            <li><Link to="/admin/plan-pagos">Plan de Pagos</Link></li>
            <li><Link to="/admin/vendedores">Vendedores</Link></li>
            <li><Link to="/admin/logs">Logs</Link></li>
          </>
        )}
        {rol === "cliente" && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/cliente/carrito">Carrito</Link></li>
            <li><Link to="/cliente/historial">Historial</Link></li>
            <li><Link to="/cliente/inicio">Inicio</Link></li>
            <li><Link to="/cliente/perfil">Perfil</Link></li>
          </>
        )}
        {rol === "vendedor" && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/vendedor/dashboard">Dashboard</Link></li>
            <li><Link to="/vendedor/inventario">Inventario</Link></li>
            <li><Link to="/vendedor/perfil">Perfil</Link></li>
            <li><Link to="/vendedor/portal">Portal</Link></li>
            <li><Link to="/vendedor/ventas">Ventas</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
