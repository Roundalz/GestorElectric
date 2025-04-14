// controllers/ventaController.js
import ventaService from "../services/ventaService.js";
import { exportVentasExcel } from "../utils/excelExport.js";

export const listVentas = async (req, res) => {
  try {
    const ventas = await ventaService.getVentas();
    res.json(ventas);
  } catch (error) {
    console.error("Error listando ventas:", error);
    res.status(500).json({ error: "Error al listar ventas", details: error.message });
  }
};

export const ventaDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await ventaService.getVentaDetail(id);
    if (!venta) return res.status(404).json({ message: "Venta no encontrada" });
    res.json(venta);
  } catch (error) {
    console.error("Error en detalle de venta:", error);
    res.status(500).json({ error: "Error al obtener detalle de venta", details: error.message });
  }
};
export const exportVentas = async (req, res) => {
  try {
    const ventas = await ventaService.getVentas();
    const workbook = await exportVentasExcel(ventas);

    // Setear headers para la descarga de Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ventas.xlsx"
    );

    // Escribir al stream y finalizar
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exportando ventas:", error);
    res.status(500).json({ error: "Error exportando ventas", details: error.message });
  }
};
export default {
  listVentas,
  ventaDetail,
  exportVentas
};
