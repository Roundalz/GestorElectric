import axios from "axios";
import { useEffect, useState } from "react";

function CrudVendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [form, setForm] = useState({
    nombre_vendedor: "",
    correo_vendedor: "",
    telefono_vendedor: "",
    clave_vendedor: "",
    estado_vendedor: "activo",
    nombre_empresa: "",
    tipo_empresa: "",
    logo_empresa: "default_logo.png",
    correo_empresa: "",
    telefono_empresa: "",
    pais_empresa: "Colombia",
    ciudad_empresa: "",
    direccion_empresa: "",
    banner_empresa: "default_banner.png",
    PLANES_PAGO_codigo_plan: 1,
  });

  const [modoEditar, setModoEditar] = useState(false);
  const [vendedorActual, setVendedorActual] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/api/vendedores";

  const obtenerVendedores = async () => {
    try {
      const res = await axios.get(API_URL);
      setVendedores(res.data);
      setError(null);
    } catch (error) {
      console.error("Error al obtener vendedores:", error);
      setError("Error al cargar los vendedores");
    }
  };

  useEffect(() => {
    obtenerVendedores();
  }, []);

  const validarFormulario = () => {
    if (!form.nombre_vendedor || !form.correo_vendedor || !form.telefono_vendedor || 
        !form.clave_vendedor || !form.nombre_empresa || !form.tipo_empresa || 
        !form.correo_empresa || !form.telefono_empresa || !form.ciudad_empresa || 
        !form.direccion_empresa) {
      setError("Por favor complete todos los campos requeridos");
      return false;
    }
    setError(null);
    return true;
  };

  const crearVendedor = async () => {
    if (!validarFormulario()) return;
    
    try {
      await axios.post(API_URL, form);
      alert("Vendedor creado exitosamente");
      obtenerVendedores();
      resetForm();
    } catch (error) {
      console.error("Error completo:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.response?.data?.detalle || error.response?.data?.error || error.message);
    }
  };

  const actualizarVendedor = async () => {
    if (!validarFormulario() || !vendedorActual) {
      setError("No se ha seleccionado un vendedor para editar");
      return;
    }
    
    try {
      await axios.put(`${API_URL}/${vendedorActual}`, form);
      alert("Vendedor actualizado exitosamente");
      obtenerVendedores();
      setModoEditar(false);
      resetForm();
    } catch (error) {
      console.error("Error al actualizar vendedor:", error);
      setError(error.response?.data?.detalle || error.response?.data?.error || error.message);
    }
  };

  const eliminarVendedor = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este vendedor?")) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Vendedor eliminado exitosamente");
      obtenerVendedores();
    } catch (error) {
      console.error("Error al eliminar vendedor:", error);
      setError(error.response?.data?.detalle || error.response?.data?.error || error.message);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    modoEditar ? actualizarVendedor() : crearVendedor();
  };

  const resetForm = () => {
    setForm({
      nombre_vendedor: "",
      correo_vendedor: "",
      telefono_vendedor: "",
      clave_vendedor: "",
      estado_vendedor: "activo",
      nombre_empresa: "",
      tipo_empresa: "",
      logo_empresa: "default_logo.png",
      correo_empresa: "",
      telefono_empresa: "",
      pais_empresa: "Colombia",
      ciudad_empresa: "",
      direccion_empresa: "",
      banner_empresa: "default_banner.png",
      PLANES_PAGO_codigo_plan: 1,
    });
    setModoEditar(false);
    setVendedorActual(null);
    setError(null);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {modoEditar ? "Editar Vendedor" : "Nuevo Vendedor"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del vendedor*</label>
            <input name="nombre_vendedor" value={form.nombre_vendedor} onChange={handleChange} 
              className="border p-2 w-full rounded" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico*</label>
            <input name="correo_vendedor" value={form.correo_vendedor} onChange={handleChange} 
              type="email" className="border p-2 w-full rounded" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono*</label>
            <input name="telefono_vendedor" value={form.telefono_vendedor} onChange={handleChange} 
              type="tel" className="border p-2 w-full rounded" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clave*</label>
            <input name="clave_vendedor" value={form.clave_vendedor} onChange={handleChange} 
              type="password" className="border p-2 w-full rounded" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select name="estado_vendedor" value={form.estado_vendedor} onChange={handleChange} 
              className="border p-2 w-full rounded">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la empresa*</label>
            <input name="nombre_empresa" value={form.nombre_empresa} onChange={handleChange} 
              className="border p-2 w-full rounded" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de empresa*</label>
            <input name="tipo_empresa" value={form.tipo_empresa} onChange={handleChange} 
              className="border p-2 w-full rounded" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo de la empresa</label>
            <input name="logo_empresa" value={form.logo_empresa} onChange={handleChange} 
              className="border p-2 w-full rounded" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo de la empresa*</label>
            <input name="correo_empresa" value={form.correo_empresa} onChange={handleChange} 
              type="email" className="border p-2 w-full rounded" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de la empresa*</label>
            <input name="telefono_empresa" value={form.telefono_empresa} onChange={handleChange} 
              className="border p-2 w-full rounded" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
            <input name="pais_empresa" value={form.pais_empresa} onChange={handleChange} 
              className="border p-2 w-full rounded" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input name="ciudad_empresa" value={form.ciudad_empresa} onChange={handleChange} 
              className="border p-2 w-full rounded" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input name="direccion_empresa" value={form.direccion_empresa} onChange={handleChange} 
              className="border p-2 w-full rounded" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner</label>
            <input name="banner_empresa" value={form.banner_empresa} onChange={handleChange} 
              className="border p-2 w-full rounded" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código del plan</label>
            <input name="PLANES_PAGO_codigo_plan" value={form.PLANES_PAGO_codigo_plan} 
              onChange={handleChange} type="number" className="border p-2 w-full rounded" />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button 
            type="button" 
            onClick={resetForm}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
             Cancelar
          </button>
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {modoEditar ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-2">Lista de Vendedores</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Correo</th>
              <th className="p-2 border">Teléfono</th>
              <th className="p-2 border">Empresa</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((vendedor) => (
              <tr key={vendedor.codigo_vendedore} className="hover:bg-gray-50">
                <td className="p-2 border">{vendedor.nombre_vendedor}</td>
                <td className="p-2 border">{vendedor.correo_vendedor}</td>
                <td className="p-2 border">{vendedor.telefono_vendedor}</td>
                <td className="p-2 border">{vendedor.nombre_empresa}</td>
                <td className="p-2 border">
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={() => {
                        setModoEditar(true);
                        setForm({ ...vendedor });
                        setVendedorActual(vendedor.codigo_vendedore);
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarVendedor(vendedor.codigo_vendedore)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CrudVendedores;