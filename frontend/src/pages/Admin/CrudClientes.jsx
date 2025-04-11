import axios from "axios";
import { useEffect, useState } from "react";

export default function CrudCliente() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nombre_cliente: "",
    correo_cliente: "",
    telefono_cliente: "",
    cumpleanos_cliente: "",
    foto_perfil_cliente: ""
  });
  const [modoEditar, setModoEditar] = useState(false);
  const [clienteActual, setClienteActual] = useState(null);

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

  const crearCliente = async () => {
    try {
      await axios.post("http://localhost:5000/api/clientes", form);
      obtenerClientes();
      setForm({
        nombre_cliente: "",
        correo_cliente: "",
        telefono_cliente: "",
        cumpleanos_cliente: "",
        foto_perfil_cliente: ""
      });
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };

  const actualizarCliente = async () => {
    try {
      await axios.put(`http://localhost:5000/api/clientes/${clienteActual}`, form);
      obtenerClientes();
      setModoEditar(false);
      setForm({
        nombre_cliente: "",
        correo_cliente: "",
        telefono_cliente: "",
        cumpleanos_cliente: "",
        foto_perfil_cliente: ""
      });
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
    }
  };

  const eliminarCliente = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clientes/${id}`);
      obtenerClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    modoEditar ? actualizarCliente() : crearCliente();
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{modoEditar ? "Editar Cliente" : "Nuevo Cliente"}</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input name="nombre_cliente" value={form.nombre_cliente} onChange={handleChange} placeholder="Nombre" className="border p-2 w-full" required />
        <input name="correo_cliente" value={form.correo_cliente} onChange={handleChange} placeholder="Correo" className="border p-2 w-full" required />
        <input name="telefono_cliente" type="number" value={form.telefono_cliente} onChange={handleChange} placeholder="Teléfono" className="border p-2 w-full" required />
        <input name="cumpleanos_cliente" type="date" value={form.cumpleanos_cliente} onChange={handleChange} className="border p-2 w-full" required />
        <input name="foto_perfil_cliente" value={form.foto_perfil_cliente} onChange={handleChange} placeholder="URL Foto Perfil" className="border p-2 w-full" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {modoEditar ? "Actualizar" : "Crear"}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Lista de Clientes</h2>
      <table className="w-full table-auto border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Correo</th>
            <th className="p-2 border">Teléfono</th>
            <th className="p-2 border">Cumpleaños</th>
            <th className="p-2 border">Foto</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.codigo_cliente}>
              <td className="p-2 border">{cliente.nombre_cliente}</td>
              <td className="p-2 border">{cliente.correo_cliente}</td>
              <td className="p-2 border">{cliente.telefono_cliente}</td>
              <td className="p-2 border">{cliente.cumpleanos_cliente}</td>
              <td className="p-2 border">
                <img src={cliente.foto_perfil_cliente} alt="Foto Perfil" className="w-12 h-12 object-cover rounded-full mx-auto" />
              </td>
              <td className="p-2 border space-x-2">
                <button onClick={() => {
                  setModoEditar(true);
                  setForm({
                    nombre_cliente: cliente.nombre_cliente,
                    correo_cliente: cliente.correo_cliente,
                    telefono_cliente: cliente.telefono_cliente,
                    cumpleanos_cliente: cliente.cumpleanos_cliente,
                    foto_perfil_cliente: cliente.foto_perfil_cliente
                  });
                  setClienteActual(cliente.codigo_cliente);
                }} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>

                <button onClick={() => eliminarCliente(cliente.codigo_cliente)} className="bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
