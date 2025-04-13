import { useEffect, useState } from "react";

function CrudPlanPagos() {
  const [planes, setPlanes] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "", monto: "" });
  const [modoEditar, setModoEditar] = useState(false);
  const [planActual, setPlanActual] = useState(null);

  // GET: Obtener planes de pago
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

  // POST: Crear nuevo plan
  const crearPlan = async () => {
    try {
      await axios.post("http://localhost:5000/api/planes", form);
      obtenerPlanes();
      setForm({ nombre: "", descripcion: "", monto: "" });
    } catch (error) {
      console.error("Error al crear plan:", error);
    }
  };

  // PUT: Editar plan
  const actualizarPlan = async () => {
    try {
      await axios.put(`http://localhost:5000/api/planes/${planActual}`, form);
      obtenerPlanes();
      setModoEditar(false);
      setForm({ nombre: "", descripcion: "", monto: "" });
    } catch (error) {
      console.error("Error al actualizar plan:", error);
    }
  };

  // DELETE: Eliminar plan
  const eliminarPlan = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/planes/${id}`);
      obtenerPlanes();
    } catch (error) {
      console.error("Error al eliminar plan:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    modoEditar ? actualizarPlan() : crearPlan();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{modoEditar ? "Editar Plan de Pago" : "Nuevo Plan de Pago"}</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre del plan"
          className="border p-2 w-full"
          required
        />
        <input
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="border p-2 w-full"
          required
        />
        <input
          name="monto"
          value={form.monto}
          onChange={handleChange}
          placeholder="Monto"
          type="number"
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {modoEditar ? "Actualizar" : "Crear"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Lista de Planes de Pago</h2>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Monto</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {planes.map((plan) => (
            <tr key={plan.id}>
              <td className="p-2 border">{plan.nombre}</td>
              <td className="p-2 border">{plan.descripcion}</td>
              <td className="p-2 border">{plan.monto}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => {
                    setModoEditar(true);
                    setForm({
                      nombre: plan.nombre,
                      descripcion: plan.descripcion,
                      monto: plan.monto,
                    });
                    setPlanActual(plan.id);
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>

                <button
                  onClick={() => eliminarPlan(plan.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CrudPlanPagos;
