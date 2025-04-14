// src/controllers/clientes.controller.js
import axios from "axios";

// Usamos una variable de entorno para el servicio de clientes.
// Puede que tus endpoints de clientes estén en el mismo microservicio de ventas,
// o en uno dedicado. Por ejemplo, si son parte de ventas, puedes establecer el valor
// en el docker-compose.yml o usar un fallback:
const CLIENTES_SERVICE_URL = process.env.CLIENTES_SERVICE_URL || "http://ventas:4000";

// Endpoint para listar clientes (y sus estadísticas)
export const listClientes = async (req, res) => {
  try {
    // Asume que el microservicio de clientes expone el endpoint /clientes
    const response = await axios.get(`${CLIENTES_SERVICE_URL}/clientes`);
    res.json(response.data);
  } catch (error) {
    console.error("Error al obtener clientes:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al obtener clientes", details: error.message });
  }
};

export default { listClientes };
