// servicios/nuevoServicio/src/controllers/ventaController.js
const ventaService = require('../services/ventaService');
const excelGenerator = require('../utils/excelGenerator');

async function listarVentas(req, res, next) {
    try {
        const { vendedorId } = req;
        const ventas = await ventaService.listarVentas(vendedorId);
        res.json(ventas);
    } catch (err) {
        next(err);
    }
}

async function obtenerVentaPorId(req, res, next) {
    try {
        const { vendedorId } = req;
        const { id } = req.params;
        const venta = await ventaService.obtenerVentaPorId(vendedorId, id);
        if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
        res.json(venta);
    } catch (err) {
        next(err);
    }
}

async function exportVentasGeneralExcel(req, res, next) {
  try {
      const { vendedorId } = req;
      const ventas = await ventaService.listarVentas(vendedorId);
      const fileBuffer = excelGenerator.generarExcelVentas(ventas);

      res.setHeader('Content-Disposition', 'attachment; filename=ventas_general.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(fileBuffer);
  } catch (err) {
      next(err);
  }
}

async function exportVentaDetalleExcel(req, res, next) {
  try {
      const { vendedorId } = req;
      const { id } = req.params;
      const venta = await ventaService.obtenerVentaPorId(vendedorId, id);
      if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });

      const fileBuffer = excelGenerator.generarExcelVentaDetalle(venta);

      res.setHeader('Content-Disposition', `attachment; filename=venta_detalle_${id}.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(fileBuffer);
  } catch (err) {
      next(err);
  }
}


module.exports = {
    listarVentas,
    obtenerVentaPorId,
    exportVentasGeneralExcel,
    exportVentaDetalleExcel,
};
