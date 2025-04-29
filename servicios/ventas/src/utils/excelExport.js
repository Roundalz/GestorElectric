// src/utils/excelExport.js
import ExcelJS from "exceljs";

/**
 * exportVentasExcel: Genera un workbook de Excel con la información de ventas.
 * @param {Array} ventasData - Array de objetos de venta. Se espera que cada objeto tenga las siguientes propiedades:
 *   - codigo_pedido
 *   - fecha_pedido
 *   - nombre_cliente (nombre del cliente que compró)
 *   - estado_pedido
 *   - total_pedido
 *
 * Puedes agregar o ajustar columnas según la información que desees exportar.
 */
export const exportVentasExcel = async (ventasData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Ventas");

  // Definir columnas (ajusta los encabezados y claves según necesites)
  worksheet.columns = [
    { header: "Código Venta", key: "codigo_pedido", width: 15 },
    { header: "Fecha de Venta", key: "fecha_pedido", width: 20 },
    { header: "Cliente", key: "nombre_cliente", width: 30 },
    { header: "Estado Venta", key: "estado_pedido", width: 15 },
    { header: "Monto Total", key: "total_pedido", width: 15 }
  ];

  // Agregar filas con los datos
  ventasData.forEach((venta) => {
    worksheet.addRow({
      codigo_pedido: venta.codigo_pedido,
      fecha_pedido: venta.fecha_pedido,
      nombre_cliente: venta.nombre_cliente,
      estado_pedido: venta.estado_pedido,
      total_pedido: venta.total_pedido
    });
  });

  // Dar formato a la fila de encabezados
  worksheet.getRow(1).font = { bold: true };

  return workbook;
};

export default { exportVentasExcel };
