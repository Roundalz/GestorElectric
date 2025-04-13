import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { AuthContext } from "../context/AuthContext"; // Ajusta el path según tu estructura
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRol("sinrol");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">GestorElectric</Link>
      
      {/* Combobox de roles para desarrollo */}
      <select onChange={(e) => setRol(e.target.value)} value={rol} className="role-select">
        <option value="sinrol">Sin Rol</option>
        <option value="admin">Admin</option>
        <option value="cliente">Cliente</option>
        <option value="vendedor">Vendedor</option>
      </select>

      {/* Sección de autenticación */}
      <div className="auth-section">
        {user ? (
          <>
            <span>
              Bienvenido, {user.nombre_cliente || user.nombre_vendedor || user.nombre || user.email} 
              {" "}(Rol: {user.role})
            </span>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </>
        ) : (
          <Link to="/login">Iniciar Sesión</Link>
        )}
      </div>

      {/* Menú de navegación */}
      <ul className="nav-links">
        {user ? (
          // Si hay usuario autenticado, se muestran opciones según su rol real
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
                <li><Link to="/vendedor/dashboard">Dashboard</Link></li>
                <li><Link to="/vendedor/inventario">Inventario</Link></li>
                <li><Link to="/vendedor/perfil">Perfil</Link></li>
                <li><Link to="/vendedor/portal">Portal</Link></li>
                <li><Link to="/vendedor/ventas">Ventas</Link></li>
              </>
            )}
          </>
        ) : (
          // Si no hay usuario autenticado, se muestran solo Home y About
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
