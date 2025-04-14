import axios from "axios";


const VENTAS_SERVICE_URL = process.env.VENTAS_SERVICE_URL || "http://ventas:4000";

// Listar todas las ventas
export const getVentas = async (req, res) => {
  try {
    const response = await axios.get(`${VENTAS_SERVICE_URL}/ventas`);
    res.json(response.data);
  } catch (error) {
    console.error("Error al obtener ventas:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al obtener ventas", details: error.message });
  }
};

// Detalle de una venta
export const getVentaDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${VENTAS_SERVICE_URL}/ventas/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error al obtener el detalle de la venta:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al obtener el detalle de la venta", details: error.message });
  }
};

// Exportar ventas a Excel
export const exportVentas = async (req, res) => {
    try {
      // Obtén las ventas del servicio de ventas
      const response = await axios.get(`${VENTAS_SERVICE_URL}/ventas`);
      const ventasData = response.data;
  
      const workbook = await exportVentasExcel(ventasData);
  
      // Configurar headers para Excel
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=ventas.xlsx"
      );
  
      // Escribir el libro al stream de respuesta
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Error al exportar ventas:", error.response?.data || error.message);
      res.status(500).json({ error: "Error al exportar ventas", details: error.message });
    }
  };
  

export default { getVentas, getVentaDetail, exportVentas };
