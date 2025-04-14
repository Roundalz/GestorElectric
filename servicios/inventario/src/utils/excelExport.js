// utils/excelExport.js
import ExcelJS from "exceljs";

export const exportProductosExcel = async (productosData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Productos");

  // Define las columnas
  worksheet.columns = [
    { header: "Código Producto", key: "codigo_producto", width: 15 },
    { header: "Nombre", key: "nombre_producto", width: 30 },
    { header: "Tipo", key: "tipo_producto", width: 15 },
    { header: "Precio", key: "precio_unidad_producto", width: 10 },
    { header: "Cantidad", key: "cantidad_disponible_producto", width: 10 },
    { header: "Estado", key: "estado_producto", width: 15 },
    { header: "Calificación", key: "calificacion_producto", width: 15 },
    { header: "Costo", key: "costo_producto", width: 10 },
    { header: "Descuento", key: "descuento_producto", width: 10 },
    { header: "Portal", key: "PORTAL_codigo_portal", width: 15 }
  ];

  // Agregar filas
  productosData.forEach((prod) => {
    worksheet.addRow({
      codigo_producto: prod.codigo_producto,
      nombre_producto: prod.nombre_producto,
      tipo_producto: prod.tipo_producto,
      precio_unidad_producto: prod.precio_unidad_producto,
      cantidad_disponible_producto: prod.cantidad_disponible_producto,
      estado_producto: prod.estado_producto,
      calificacion_producto: prod.calificacion_producto,
      costo_producto: prod.costo_producto,
      descuento_producto: prod.descuento_producto,
      PORTAL_codigo_portal: prod.PORTAL_codigo_portal
    });
  });

  // Formato de encabezados en negrita
  worksheet.getRow(1).font = { bold: true };

  return workbook;
};

export default { exportProductosExcel };
