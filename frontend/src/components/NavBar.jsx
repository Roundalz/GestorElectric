import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { AuthContext } from "../context/AuthContext"; // Ajusta el path según tu estructura
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function NavBar() {
  const [rol, setRol] = useState("admin"); // Opciones: 'admin', 'cliente', 'vendedor'
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">GestorElectric</Link>
      
      <select onChange={(e) => setRol(e.target.value)} value={rol} className="role-select">
        <option value="admin">Admin</option>
        <option value="cliente">Cliente</option>
        <option value="vendedor">Vendedor</option>
      </select>

      {/* Sección de autenticación */}
      <div className="auth-section">
        {user ? (
          <>
            <span>Bienvenido, {user.nombre_cliente || user.email}</span>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </>
        ) : (
          <Link to="/login">Iniciar Sesión</Link>
        )}
      </div>

      <ul className="nav-links">
        {rol === "admin" && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
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
