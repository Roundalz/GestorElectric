import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import PlanesPago from './components/planesPago';

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
import ProductDetail from "./pages/Vendedor/ProductDetail"; 
import PerfilVendedor from "./pages/Vendedor/Perfil";
import Ventas from "./pages/Vendedor/Ventas";
import ConfigPortal from './pages/Vendedor/Portal/ConfigPortal';
import PortalView from './pages/Vendedor/Portal/PortalView';
import ProductEditor from './pages/Vendedor/Portal/ProductEdit';
import { VendedorProvider } from '@context/vendedorContext';

import SalesDetail from "./pages/Vendedor/SalesDetail";
import AddProduct from "./pages/Vendedor/AddProduct"; // Nueva página para agregar productos

import Login from "./components/Login";
import "./App.css"; // Importamos los estilos globales
import Register from "./components/Register";

function App() {
  return (
    <VendedorProvider>
      <div className="app-container">
      <NavBar />
      <div className="content">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/planes-pago" element={<PlanesPago />} />

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
          <Route path="/vendedor/portal/config" element={<ConfigPortal />} />
          <Route path="/vendedor/portal/view" element={<PortalView />} />
          <Route path="/vendedor/portal/productos" element={<ProductEditor />} />
          <Route path="/vendedor/ventas" element={<Ventas />} />
          <Route path="/inventario/:id" element={<ProductDetail />} />
          <Route path="/ventas/:id" element={<SalesDetail />} />
          <Route path="/agregar-producto" element={<AddProduct />} />


          {/* Ruta para manejar páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
    </VendedorProvider>
  );
}

export default App;
