import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function NavBar() {
  const [rol, setRol] = useState("sinrol");
  const { user, setUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setRol(user?.role ?? "sinrol");
  }, [user]);

  const handleLogout = async () => {
    try {
      if (user?.codigo_cliente || user?.codigo_vendedore) {
        const usuario_id = user.codigo_cliente ?? user.codigo_vendedore;
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario_id }),
        });
      }
      await signOut(auth);
      setUser(null);
      setRol("sinrol");
      setMenuOpen(false);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const toggleMenu = () => setMenuOpen((o) => !o);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Logo" className="nav-logo-img" />
          <span className="nav-logo-text">GestorElectric</span>
        </Link>

        {/* Toggle hamburguesa */}
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Links + Auth */}
        <div className={`navbar-menu${menuOpen ? " open" : ""}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" onClick={toggleMenu}>Inicio</Link>
            </li>
            <li>
              <Link to="/about" onClick={toggleMenu}>Sobre Nosotros</Link>
            </li>

            {user?.role === "admin" && (
              <>
                <li><Link to="/admin/clientes" onClick={toggleMenu}>Clientes</Link></li>
                <li><Link to="/admin/plan-pagos" onClick={toggleMenu}>Planes</Link></li>
                <li><Link to="/admin/vendedores" onClick={toggleMenu}>Vendedores</Link></li>
                <li><Link to="/admin/logs" onClick={toggleMenu}>Logs</Link></li>
              </>
            )}
            {user?.role === "cliente" && (
              <>
                <li><Link to="/cliente/carrito" onClick={toggleMenu}>Carrito</Link></li>
                <li><Link to="/cliente/historial" onClick={toggleMenu}>Historial</Link></li>
                <li><Link to="/cliente/inicio" onClick={toggleMenu}>Inicio</Link></li>
                <li><Link to="/cliente/perfil" onClick={toggleMenu}>Perfil</Link></li>
              </>
            )}
            {user?.role === "vendedor" && (
              <>
                <li><Link to="/vendedor/dashboard" onClick={toggleMenu}>Dashboard</Link></li>
                <li><Link to="/vendedor/inventario" onClick={toggleMenu}>Inventario</Link></li>
                <li><Link to="/vendedor/perfil" onClick={toggleMenu}>Perfil</Link></li>
                <li><Link to="/vendedor/portal/view" onClick={toggleMenu}>Vista</Link></li>
                <li><Link to="/vendedor/portal/config" onClick={toggleMenu}>Config</Link></li>
                <li><Link to="/vendedor/portal/productos" onClick={toggleMenu}>Productos</Link></li>
                <li><Link to="/vendedor/ventas" onClick={toggleMenu}>Ventas</Link></li>
              </>
            )}
          </ul>

          <div className="auth-section">
            {user ? (
              <>
                <span className="welcome-text">
                  {user.nombre_cliente ||
                    user.nombre_vendedor ||
                    user.nombre ||
                    user.email}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="login-icon-link" onClick={toggleMenu}>
                <FaUserCircle className="login-icon" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
