import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import '../../styles/CrudPlanPagos.css';

function CrudPlanPagos() {
  const [planes, setPlanes] = useState([]);
  const [form, setForm] = useState({
    nombre_plan: "",
    descripcion: "",
    precio_m_s_a: "",
    comision_venta: "",
    max_productos: "",
    fecha_expiracion_plan: "",
  });
  const [modoEditar, setModoEditar] = useState(false);
  const [planActual, setPlanActual] = useState(null);

  const obtenerPlanes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/planes_pago");
      setPlanes(res.data);
    } catch (error) {
      console.error("Error al obtener planes:", error);
    }
  };

  useEffect(() => {
    obtenerPlanes();
  }, []);

  const crearPlan = async () => {
    try {
      await axios.post("http://localhost:5000/api/planes_pago", form);
      obtenerPlanes();
      resetForm();
    } catch (error) {
      console.error("Error al crear plan:", error);
    }
  };

  const actualizarPlan = async () => {
    try {
      await axios.put(`http://localhost:5000/api/planes_pago/${planActual}`, form);
      obtenerPlanes();
      setModoEditar(false);
      resetForm();
    } catch (error) {
      console.error("Error al actualizar plan:", error);
    }
  };

  const eliminarPlan = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/planes_pago/${id}`);
      obtenerPlanes();
    } catch (error) {
      console.error("Error al eliminar plan:", error);
    }
  };

  const resetForm = () => {
    setForm({
      nombre_plan: "",
      descripcion: "",
      precio_m_s_a: "",
      comision_venta: "",
      max_productos: "",
      fecha_expiracion_plan: "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    modoEditar ? actualizarPlan() : crearPlan();
  };

  return (
    <div className="crud-container">
      <h1 className="crud-title">
        {modoEditar ? "Editar Plan de Pago" : "Nuevo Plan de Pago"}
      </h1>

      <form onSubmit={handleSubmit} className="crud-form">
        <input
          name="nombre_plan"
          value={form.nombre_plan}
          onChange={handleChange}
          placeholder="Nombre del plan"
          className="crud-input"
          required
        />
        <input
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="crud-input"
          required
        />
        <input
          name="precio_m_s_a"
          value={form.precio_m_s_a}
          onChange={handleChange}
          placeholder="Precio mensual (Bs)"
          type="number"
          step="0.01"
          className="crud-input"
          required
        />
        <input
          name="comision_venta"
          value={form.comision_venta}
          onChange={handleChange}
          placeholder="Comisión (%)"
          type="number"
          step="0.01"
          className="crud-input"
          required
        />
        <input
          name="max_productos"
          value={form.max_productos}
          onChange={handleChange}
          placeholder="Máx. productos"
          type="number"
          className="crud-input"
          required
        />
        <input
          name="fecha_expiracion_plan"
          value={form.fecha_expiracion_plan}
          onChange={handleChange}
          type="date"
          className="crud-input"
          required
        />

        <button type="submit" className="crud-button">
          {modoEditar ? "Actualizar" : "Crear"}
        </button>
      </form>

      <h2 className="crud-subtitle">Planes de Pago Registrados</h2>

      <div className="crud-table-container">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Comisión</th>
              <th>Máx. Productos</th>
              <th>Expira</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {planes.map((plan) => (
              <tr key={plan.codigo_plan}>
                <td>{plan.nombre_plan}</td>
                <td>{plan.descripcion}</td>
                <td>{plan.precio_m_s_a} Bs</td>
                <td>{plan.comision_venta}%</td>
                <td>{plan.max_productos}</td>
                <td>{plan.fecha_expiracion_plan}</td>
                <td className="crud-actions">
                  <button
                    onClick={() => {
                      setModoEditar(true);
                      setForm({
                        nombre_plan: plan.nombre_plan,
                        descripcion: plan.descripcion,
                        precio_m_s_a: plan.precio_m_s_a,
                        comision_venta: plan.comision_venta,
                        max_productos: plan.max_productos,
                        fecha_expiracion_plan: plan.fecha_expiracion_plan,
                      });
                      setPlanActual(plan.codigo_plan);
                    }}
                    className="edit-button"
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={() => eliminarPlan(plan.codigo_plan)}
                    className="delete-button"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CrudPlanPagos;
