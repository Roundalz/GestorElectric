import { useEffect, useState } from "react";

export default function CrudCliente() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: "", correo: "", telefono: "" });
  const [modoEditar, setModoEditar] = useState(false);
  const [clienteActual, setClienteActual] = useState(null);

  // GET: Obtener clientes
  const obtenerClientes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clientes");
      setClientes(res.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  // POST: Crear nuevo cliente
  const crearCliente = async () => {
    try {
      await axios.post("http://localhost:5000/api/clientes", form);
      obtenerClientes();
      setForm({ nombre: "", correo: "", telefono: "" });
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };

  // PUT: Editar cliente
  const actualizarCliente = async () => {
    try {
      await axios.put(`http://localhost:5000/api/clientes/${clienteActual}`, form);
      obtenerClientes();
      setModoEditar(false);
      setForm({ nombre: "", correo: "", telefono: "" });
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
    }
  };

  // DELETE: Eliminar cliente
  const eliminarCliente = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clientes/${id}`);
      obtenerClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    modoEditar ? actualizarCliente() : crearCliente();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{modoEditar ? "Editar Cliente" : "Nuevo Cliente"}</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 w-full" required />
        <input name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" className="border p-2 w-full" required />
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="border p-2 w-full" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {modoEditar ? "Actualizar" : "Crear"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Lista de Clientes</h2>
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
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td className="p-2 border">{cliente.nombre}</td>
              <td className="p-2 border">{cliente.correo}</td>
              <td className="p-2 border">{cliente.telefono}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => {
                  setModoEditar(true);
                  setForm({ nombre: cliente.nombre, correo: cliente.correo, telefono: cliente.telefono });
                  setClienteActual(cliente.id);
                }} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>

                <button onClick={() => eliminarCliente(cliente.id)} className="bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
