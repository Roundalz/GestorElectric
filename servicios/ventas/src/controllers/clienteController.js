// controllers/clienteController.js
import clienteService from "../services/clienteService.js";

const VENDEDOR_ID = 1;

export const listClientes = async (req, res) => {
  try {
    const clientes = await clienteService.getClientes(VENDEDOR_ID, { ip: req.ip });
    res.json(clientes);
  } catch (error) {
    console.error("Error listando clientes:", error.message);
    res.status(500).json({ error: "Error al listar clientes", details: error.message });
  }
};

export default { listClientes };
