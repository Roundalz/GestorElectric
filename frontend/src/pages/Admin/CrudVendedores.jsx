import axios from "axios";
import { useEffect, useState } from "react";

function CrudVendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [form, setForm] = useState({ nombre: "", correo: "", telefono: "" });
  const [modoEditar, setModoEditar] = useState(false);
  const [vendedorActual, setVendedorActual] = useState(null);

  // GET: Obtener vendedores
  const obtenerVendedores = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vendedores");
      setVendedores(res.data);
    } catch (error) {
      console.error("Error al obtener vendedores:", error);
    }
  };

  useEffect(() => {
    obtenerVendedores();
  }, []);

  // POST: Crear nuevo vendedor
  const crearVendedor = async () => {
    try {
      await axios.post("http://localhost:5000/api/vendedores", form);
      obtenerVendedores();
      setForm({ nombre: "", correo: "", telefono: "" });
    } catch (error) {
      console.error("Error al crear vendedor:", error);
    }
  };

  // PUT: Editar vendedor
  const actualizarVendedor = async () => {
    try {
      await axios.put(`http://localhost:5000/api/vendedores/${vendedorActual}`, form);
      obtenerVendedores();
      setModoEditar(false);
      setForm({ nombre: "", correo: "", telefono: "" });
    } catch (error) {
      console.error("Error al actualizar vendedor:", error);
    }
  };

  // DELETE: Eliminar vendedor
  const eliminarVendedor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/vendedores/${id}`);
      obtenerVendedores();
    } catch (error) {
      console.error("Error al eliminar vendedor:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    modoEditar ? actualizarVendedor() : crearVendedor();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{modoEditar ? "Editar Vendedor" : "Nuevo Vendedor"}</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre del vendedor"
          className="border p-2 w-full"
          required
        />
        <input
          name="correo"
          value={form.correo}
          onChange={handleChange}
          placeholder="Correo electrónico"
          type="email"
          className="border p-2 w-full"
          required
        />
        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          type="tel"
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {modoEditar ? "Actualizar" : "Crear"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Lista de Vendedores</h2>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Correo</th>
            <th className="p-2 border">Teléfono</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vendedores.map((vendedor) => (
            <tr key={vendedor.id}>
              <td className="p-2 border">{vendedor.nombre}</td>
              <td className="p-2 border">{vendedor.correo}</td>
              <td className="p-2 border">{vendedor.telefono}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => {
                    setModoEditar(true);
                    setForm({
                      nombre: vendedor.nombre,
                      correo: vendedor.correo,
                      telefono: vendedor.telefono,
                    });
                    setVendedorActual(vendedor.id);
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>

                <button
                  onClick={() => eliminarVendedor(vendedor.id)}
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

export default CrudVendedores;
