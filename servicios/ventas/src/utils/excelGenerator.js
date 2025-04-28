// servicios/nuevoServicio/src/utils/excelGenerator.js
const XLSX = require('xlsx');

function generarExcelVentas(ventas) {
    const data = ventas.map(v => ({
        'Código Pedido': v.codigo_pedido,
        'Fecha Pedido': v.fecha_pedido,
        'Estado Pedido': v.estado_pedido,
        'Total Pedido': v.total_pedido,
        'Cliente': v.nombre_cliente,
        'Correo Cliente': v.correo_cliente,
        'Productos Vendidos': v.productos?.map(p => `${p.producto} (x${p.cantidad})`).join('; ') || '',
        'GiftCard Aplicada': v.giftcard_aplicada || 'No',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return buffer;
}

function generarExcelVentaDetalle(venta) {
    const data = venta.productos?.map(p => ({
        'Producto': p.producto,
        'Cantidad': p.cantidad,
        'Precio Unitario': p.precio,
        'Subtotal': p.subtotal,
    })) || [];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalle Venta');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return buffer;
}

module.exports = {
    generarExcelVentas,
    generarExcelVentaDetalle,
};
