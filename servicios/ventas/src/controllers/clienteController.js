// controllers/clienteController.js
import clienteService from "../services/clienteService.js";

export const listClientes = async (req, res) => {
  try {
    const clientes = await clienteService.getClientes();
    res.json(clientes);
  } catch (error) {
    console.error("Error listando clientes:", error);
    res.status(500).json({ error: "Error al listar clientes", details: error.message });
  }
};

export default {
  listClientes
};
