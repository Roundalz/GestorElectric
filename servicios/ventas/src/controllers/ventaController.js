// controllers/ventaController.js
import ventaService from "../services/ventaService.js";

// Usamos un dato estático para el vendedor (1) por ahora
const VENDEDOR_ID = 1;

export const listVentas = async (req, res) => {
  try {
    // Puedes obtener la IP del request si es necesario (req.ip)
    const ventas = await ventaService.getVentas(VENDEDOR_ID, { ip: req.ip });
    res.json(ventas);
  } catch (error) {
    console.error("Error listando ventas:", error.message);
    res.status(500).json({ error: "Error al listar ventas", details: error.message });
  }
};

export const ventaDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await ventaService.getVentaDetail(id, VENDEDOR_ID, { ip: req.ip });
    if (!venta) return res.status(404).json({ message: "Venta no encontrada" });
    res.json(venta);
  } catch (error) {
    console.error("Error obteniendo detalle de venta:", error.message);
    res.status(500).json({ error: "Error al obtener detalle de venta", details: error.message });
  }
};
export const exportVentas = async (req, res) => {
  try {
    // Obtenemos las ventas (filtradas por vendedor 1, por ejemplo)
    const response = await axios.get(`${VENTAS_SERVICE_URL}/ventas`);
    const ventasData = response.data;

    const workbook = await exportVentasExcel(ventasData);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ventas.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error al exportar ventas:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al exportar ventas", details: error.message });
  }
};

export default { listVentas, ventaDetail, exportVentas };
