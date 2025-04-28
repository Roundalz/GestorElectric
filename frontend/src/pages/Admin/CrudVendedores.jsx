import axios from "axios";
import { useEffect, useState } from "react";
import "../../styles/crudVendedores.css"; // Solo lo importamos, no como módulo

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
    <div className="container">
      <h1 className="title">
        {modoEditar ? "Editar Vendedor" : "Nuevo Vendedor"}
      </h1>

      {error && (
        <div className="errorBox">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="grid">
          {/* Inputs */}
          {[
            { label: "Nombre del vendedor*", name: "nombre_vendedor", type: "text" },
            { label: "Correo electrónico*", name: "correo_vendedor", type: "email" },
            { label: "Teléfono*", name: "telefono_vendedor", type: "tel" },
            { label: "Clave*", name: "clave_vendedor", type: "password" },
            { label: "Nombre de la empresa*", name: "nombre_empresa", type: "text" },
            { label: "Tipo de empresa*", name: "tipo_empresa", type: "text" },
            { label: "Logo de la empresa", name: "logo_empresa", type: "text" },
            { label: "Correo de la empresa*", name: "correo_empresa", type: "email" },
            { label: "Teléfono de la empresa*", name: "telefono_empresa", type: "text" },
            { label: "País", name: "pais_empresa", type: "text" },
            { label: "Ciudad", name: "ciudad_empresa", type: "text" },
            { label: "Dirección", name: "direccion_empresa", type: "text" },
            { label: "Banner", name: "banner_empresa", type: "text" },
            { label: "Código del plan", name: "PLANES_PAGO_codigo_plan", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="label">{label}</label>
              <input
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                className="input"
                required={label.includes('*')}
              />
            </div>
          ))}
          {/* Estado */}
          <div>
            <label className="label">Estado</label>
            <select
              name="estado_vendedor"
              value={form.estado_vendedor}
              onChange={handleChange}
              className="input"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="buttonGroup">
          <button type="button" onClick={resetForm} className="cancelButton">
            Cancelar
          </button>
          <button type="submit" className="submitButton">
            {modoEditar ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>

      <h2 className="subTitle">Lista de Vendedores</h2>

      <div className="overflow-x-auto">
        <table className="table">
          <thead className="tableHead">
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Empresa</th>
              <th>Logo</th>
              <th>Banner</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((vendedor) => (
              <tr key={vendedor.codigo_vendedore} className="tableRow">
                <td>{vendedor.nombre_vendedor}</td>
                <td>{vendedor.correo_vendedor}</td>
                <td>{vendedor.telefono_vendedor}</td>
                <td>{vendedor.nombre_empresa}</td>
                <td>
                  <img src={vendedor.logo_empresa} alt="Logo" className="logoImg" />
                </td>
                <td>
                  <img src={vendedor.banner_empresa} alt="Banner" className="bannerImg" />
                </td>
                <td>
                  <div className="actions">
                    <button
                      onClick={() => {
                        setModoEditar(true);
                        setForm({ ...vendedor });
                        setVendedorActual(vendedor.codigo_vendedore);
                      }}
                      className="editButton"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarVendedor(vendedor.codigo_vendedore)}
                      className="deleteButton"
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
