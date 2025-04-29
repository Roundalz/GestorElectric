import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { AuthContext } from "../context/AuthContext";
import { useCart } from '../context/CartContext';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";


export default function NavBar() {
  const navigate = useNavigate();

  const { cart, removeFromCart } = useCart();
  const [mostrarMenu, setMostrarMenu] = useState(false);


  const irAlCarrito = () => {
    navigate('/cliente/carrito');
  };
  // Para desarrollo, se mantiene el combobox; se incluye la opción 'sinrol'
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
                <li><Link to="/admin/accountlock" onClick={toggleMenu}>Cuentas Bloqueadas</Link></li>
              </>
            )}
            {user?.role === "cliente" && (
              <>
                <div className="carrito-container"
                    onMouseEnter={() => document.querySelector('.carrito-menu').style.display = 'block'}
                    onMouseLeave={() => document.querySelector('.carrito-menu').style.display = 'none'}
                  >
                    <button className="carrito-btn" onClick={irAlCarrito}>
                      Carrito ({cart.reduce((acc, item) => acc + item.cantidad, 0)})
                    </button>
                      <div className="carrito-menu">
                        {cart.length === 0 ? (
                        <p>El carrito está vacío</p>
                      ) : (
                        cart.map((item) => (
                          <div key={item.codigo_producto} className="item-carrito">
                            <div className="texto-item">
                              <p>{item.nombre_producto} (x{item.cantidad})</p>
                              <p>${item.precio_unidad_producto * item.cantidad}</p>
                            </div>
                            <button
                              className="eliminar-btn"
                              onClick={() => removeFromCart(item.codigo_producto)}
                            >
                              ❌
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
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

        {/* Menú de navegación */}
      </div>
    </nav>
  );
}
