import axios from "axios";
import React, { useEffect, useState } from "react";
import '../../styles/crudCliente.css'; // importamos estilos propios

export default function CrudCliente() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: "", correo: "", telefono: "" });
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
      await axios.post("http://localhost:5000/api/clientes", {
        nombre_cliente: form.nombre,
        correo_cliente: form.correo,
        telefono_cliente: form.telefono,
        cumpleanos_cliente: "2000-01-01",
        foto_perfil_cliente: "default.png"
      });

      obtenerClientes();
      setForm({ nombre: "", correo: "", telefono: "" });
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };

  const actualizarCliente = async () => {
    try {
      await axios.put(`http://localhost:5000/api/clientes/${clienteActual}`, {
        nombre_cliente: form.nombre,
        correo_cliente: form.correo,
        telefono_cliente: form.telefono,
        cumpleanos_cliente: "2000-01-01",
        foto_perfil_cliente: "default.png"
      });

      obtenerClientes();
      setModoEditar(false);
      setForm({ nombre: "", correo: "", telefono: "" });
      setClienteActual(null);
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
    <div className="crud-cliente-container">
      <h1 className="crud-cliente-title">{modoEditar ? "Editar Cliente" : "Nuevo Cliente"}</h1>
      <form onSubmit={handleSubmit} className="crud-cliente-form">
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="crud-cliente-input"
          required
        />
        <input
          name="correo"
          value={form.correo}
          onChange={handleChange}
          placeholder="Correo"
          className="crud-cliente-input"
          required
        />
        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          className="crud-cliente-input"
          required
        />
        <button type="submit" className="crud-cliente-button">
          {modoEditar ? "Actualizar" : "Crear"}
        </button>
      </form>

      <h2 className="crud-cliente-subtitle">Lista de Clientes</h2>
      <div className="crud-cliente-table-container">
        <table className="crud-cliente-table">
          <thead>
            <tr>
              <th>Perfil</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.codigo_cliente}>
                <td className="crud-cliente-center">👤</td>
                <td>{cliente.nombre_cliente}</td>
                <td>{cliente.correo_cliente}</td>
                <td>{cliente.telefono_cliente}</td>
                <td className="crud-cliente-actions">
                  <button
                    onClick={() => {
                      setModoEditar(true);
                      setForm({
                        nombre: cliente.nombre_cliente,
                        correo: cliente.correo_cliente,
                        telefono: cliente.telefono_cliente
                      });
                      setClienteActual(cliente.codigo_cliente);
                    }}
                    className="crud-cliente-edit-button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarCliente(cliente.codigo_cliente)}
                    className="crud-cliente-delete-button"
                  >
                    Eliminar
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
