// orquestador/src/controllers/ventasController.js
import fetch from 'node-fetch';
import { getVendedorId } from '../utils/getVendedorId.js';

const baseUrl = process.env.NUEVO_SERVICIO_URL || 'http://localhost:4000/api/ventas';

export async function proxyVentas(req, res) {
  try {
    const vendedorId = getVendedorId(req);
    const response = await fetch(`${baseUrl}/ventas`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Vendedor-Id': vendedorId,
      },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error en proxyVentas:', error);
    res.status(500).json({ error: 'Error proxyVentas' });
  }
}

export async function proxyVentaDetalle(req, res) {
  try {
    const vendedorId = getVendedorId(req);
    const { id } = req.params;
    const response = await fetch(`${baseUrl}/ventas/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Vendedor-Id': vendedorId,
      },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error en proxyVentaDetalle:', error);
    res.status(500).json({ error: 'Error proxyVentaDetalle' });
  }
}

export async function proxyClientes(req, res) {
  try {
    const vendedorId = getVendedorId(req);
    const response = await fetch(`${baseUrl}/clientes`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Vendedor-Id': vendedorId,
      },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error en proxyClientes:', error);
    res.status(500).json({ error: 'Error proxyClientes' });
  }
}

export async function proxyClienteDetalle(req, res) {
  try {
    const vendedorId = getVendedorId(req);
    const { id } = req.params;
    const response = await fetch(`${baseUrl}/clientes/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Vendedor-Id': vendedorId,
      },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error en proxyClienteDetalle:', error);
    res.status(500).json({ error: 'Error proxyClienteDetalle' });
  }
}
export async function crearGiftCard(req, res) {
  try {
    const vendedorId = getVendedorId(req);
    const response = await fetch(`${baseUrl}/giftcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Vendedor-Id': vendedorId,
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error en crearGiftCard:', error);
    res.status(500).json({ error: 'Error al crear GiftCard' });
  }
}

export async function listarGiftCards(req, res) {
  try {
    const vendedorId = getVendedorId(req);
    const response = await fetch(`${baseUrl}/giftcards`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Vendedor-Id': vendedorId,
      },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error en listarGiftCards:', error);
    res.status(500).json({ error: 'Error al listar GiftCards' });
  }
}

export async function actualizarGiftCard(req, res) {
  try {
    const vendedorId = getVendedorId(req);
    const { id } = req.params;
    const response = await fetch(`${baseUrl}/giftcards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Vendedor-Id': vendedorId,
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error en actualizarGiftCard:', error);
    res.status(500).json({ error: 'Error al actualizar GiftCard' });
  }
}

export async function eliminarGiftCard(req, res) {
  try {
    const vendedorId = getVendedorId(req);
    const { id } = req.params;
    const response = await fetch(`${baseUrl}/giftcards/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Vendedor-Id': vendedorId,
      },
    });
    res.status(response.status).send();
  } catch (error) {
    console.error('Error en eliminarGiftCard:', error);
    res.status(500).json({ error: 'Error al eliminar GiftCard' });
  }
}

// --- Exportaciones Excel ---
export async function exportVentasGeneral(req, res) {
  try {
    const vendedorId = getVendedorId(req);
    const response = await fetch(`${baseUrl}/ventas/export/general`, {
      headers: {
        'X-Vendedor-Id': vendedorId,
      },
    });

    const buffer = await response.buffer();
    res.setHeader('Content-Disposition', 'attachment; filename=ventas_general.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.status(response.status).send(buffer);
  } catch (error) {
    console.error('Error en exportVentasGeneral:', error);
    res.status(500).json({ error: 'Error exportando ventas general' });
  }
}

export async function exportVentaDetalle(req, res) {
  try {
    const vendedorId = getVendedorId(req);
    const { id } = req.params;
    const response = await fetch(`${baseUrl}/ventas/export/${id}`, {
      headers: {
        'X-Vendedor-Id': vendedorId,
      },
    });

    const buffer = await response.buffer();
    res.setHeader('Content-Disposition', `attachment; filename=venta_detalle_${id}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.status(response.status).send(buffer);
  } catch (error) {
    console.error('Error en exportVentaDetalle:', error);
    res.status(500).json({ error: 'Error exportando venta detalle' });
  }
}