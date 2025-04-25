import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
// Usamos FaUserCircle para representar el login
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png"; // Importa el logo desde assets


function NavBar() {
  // Para desarrollo, se mantiene el combobox; se incluye la opción 'sinrol'
  const [rol, setRol] = useState("sinrol");
  const { user, setUser } = useContext(AuthContext);

  // Si hay usuario autenticado, forzamos el rol a su rol real
  useEffect(() => {
    if (user && user.role) {
      setRol(user.role);
    } else {
      setRol("sinrol");
    }
  }, [user]);

  // ...
const handleLogout = async () => {
  try {
    /* 1. avisamos al backend (solo si hay user y tiene id) */
    if (user?.codigo_cliente || user?.codigo_vendedore) {
      const usuario_id = user.codigo_cliente ?? user.codigo_vendedore;
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id })
      });
      console.log('Logout registrado para usuario', usuario_id);
    }

    /* 2. cerramos sesión Firebase y limpiamos contexto */
    await signOut(auth);
    setUser(null);
    setRol('sinrol');
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
  }
};

  

  return (
    <nav className="navbar">
      {/* Sección izquierda: Logo principal */}
      <div className="navbar-left">
        <Link to="/" className="nav-logo">
          <div className="logo-container">
            {/* Puedes reemplazar este ícono por otro que se relacione más con tu marca */}
            <img src={logo} alt="Logo" className="nav-logo-img" />
          </div>
          <span className="nav-logo-text">GestorElectric</span>
        </Link>
      </div>

      {/* Sección central (combobox de roles para desarrollo) */}
      <div className="navbar-middle">
        <select
          onChange={(e) => setRol(e.target.value)}
          value={rol}
          className="role-select"
        >
          <option value="sinrol">Sin Rol</option>
          <option value="admin">Admin</option>
          <option value="cliente">Cliente</option>
          <option value="vendedor">Vendedor</option>
        </select>
      </div>

      {/* Sección derecha: Autenticación y menú */}
      <div className="navbar-right">
        <div className="auth-section">
          {user ? (
            <>
              <span className="welcome-text">
                Bienvenido,{" "}
                {user.nombre_cliente ||
                  user.nombre_vendedor ||
                  user.nombre ||
                  user.email}{" "}
                (Rol: {user.role})
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </>
          ) : (
            // Mostramos un ícono representativo de inicio de sesión
            <Link to="/login" className="login-icon-link">
              <FaUserCircle className="login-icon" />
            </Link>
          )}
        </div>

        {/* Menú de navegación */}
        <ul className="nav-links">
          {user ? (
            <>
              {user.role === "admin" && (
                <>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/admin/clientes">Clientes</Link></li>
                  <li><Link to="/admin/plan-pagos">Plan de Pagos</Link></li>
                  <li><Link to="/admin/vendedores">Vendedores</Link></li>
                  <li><Link to="/admin/logs">Logs</Link></li>
                </>
              )}
              {user.role === "cliente" && (
                <>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/cliente/carrito">Carrito</Link></li>
                  <li><Link to="/cliente/historial">Historial</Link></li>
                  <li><Link to="/cliente/inicio">Inicio</Link></li>
                  <li><Link to="/cliente/perfil">Perfil</Link></li>
                </>
              )}
              {user.role === "vendedor" && (
                <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/vendedor/dashboard">Dashboard</Link></li>
            <li><Link to="/vendedor/inventario">Inventario</Link></li>
            <li><Link to="/vendedor/perfil">Perfil</Link></li>
            <li><Link to="/vendedor/portal/view">Vista</Link></li>
            <li><Link to="/vendedor/portal/config">Config</Link></li>
            <li><Link to="/vendedor/portal/productos">Productos</Link></li>
            <li><Link to="/vendedor/ventas">Ventas</Link></li>
                </>
              )}
            </>
          ) : (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
