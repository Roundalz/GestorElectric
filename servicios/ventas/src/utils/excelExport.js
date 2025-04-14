// src/utils/excelExport.js
import ExcelJS from "exceljs";

export const exportVentasExcel = async (ventasData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Ventas");

  // Define las columnas - ajusta según tu necesidad
  worksheet.columns = [
    { header: "Código Venta", key: "codigo_pedido", width: 15 },
    { header: "Fecha de Venta", key: "fecha_pedido", width: 15 },
    { header: "Cliente", key: "nombre_cliente", width: 25 },
    { header: "Estado Venta", key: "estado_pedido", width: 15 },
    { header: "Monto Total", key: "total_pedido", width: 15 }
  ];

  // Agrega las filas
  ventasData.forEach((venta) => {
    worksheet.addRow({
      codigo_pedido: venta.codigo_pedido,
      fecha_pedido: venta.fecha_pedido,
      nombre_cliente: venta.nombre_cliente,
      estado_pedido: venta.estado_pedido,
      total_pedido: venta.total_pedido
    });
  });

  return workbook;
};

// Exportación por defecto opcional, para poder importar de forma unificada
export default { exportVentasExcel };
