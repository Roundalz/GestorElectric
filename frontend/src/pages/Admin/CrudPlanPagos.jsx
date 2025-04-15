import axios from "axios";

import { useEffect, useState } from "react";

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
      const res = await axios.get("http://localhost:5000/api/planes");
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
      await axios.post("http://localhost:5000/api/planes", form);
      obtenerPlanes();
      resetForm();
    } catch (error) {
      console.error("Error al crear plan:", error);
    }
  };

  const actualizarPlan = async () => {
    try {
      await axios.put(`http://localhost:5000/api/planes/${planActual}`, form);
      obtenerPlanes();
      setModoEditar(false);
      resetForm();
    } catch (error) {
      console.error("Error al actualizar plan:", error);
    }
  };

  const eliminarPlan = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/planes/${id}`);
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
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {modoEditar ? "Editar Plan de Pago" : "Nuevo Plan de Pago"}
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input name="nombre_plan" value={form.nombre_plan} onChange={handleChange} placeholder="Nombre del plan" className="border p-2 rounded" required />
        <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="border p-2 rounded" required />
        <input name="precio_m_s_a" value={form.precio_m_s_a} onChange={handleChange} placeholder="Precio mensual (Bs)" type="number" step="0.01" className="border p-2 rounded" required />
        <input name="comision_venta" value={form.comision_venta} onChange={handleChange} placeholder="Comisión (%)" type="number" step="0.01" className="border p-2 rounded" required />
        <input name="max_productos" value={form.max_productos} onChange={handleChange} placeholder="Máx. productos" type="number" className="border p-2 rounded" required />
        <input name="fecha_expiracion_plan" value={form.fecha_expiracion_plan} onChange={handleChange} type="date" className="border p-2 rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded col-span-2 hover:bg-blue-700 transition">
          {modoEditar ? "Actualizar" : "Crear"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Planes de Pago Registrados</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Descripción</th>
              <th className="p-2 border">Precio</th>
              <th className="p-2 border">Comisión</th>
              <th className="p-2 border">Máx. Productos</th>
              <th className="p-2 border">Expira</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {planes.map((plan) => (
              <tr key={plan.codigo_plan}>
                <td className="p-2 border">{plan.nombre_plan}</td>
                <td className="p-2 border">{plan.descripcion}</td>
                <td className="p-2 border">{plan.precio_m_s_a} Bs</td>
                <td className="p-2 border">{plan.comision_venta}%</td>
                <td className="p-2 border">{plan.max_productos}</td>
                <td className="p-2 border">{plan.fecha_expiracion_plan}</td>
                <td className="p-2 border flex gap-2 justify-center">
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
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={() => eliminarPlan(plan.codigo_plan)}
                    className="text-red-600 hover:text-red-700"
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