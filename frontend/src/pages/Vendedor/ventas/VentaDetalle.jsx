// frontend/src/pages/Vendedor/ventas/VentaDetalle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVendedor } from '@/context/VendedorContext';

export default function VentaDetalle() {
  const { id } = useParams();
  const { vendedorId } = useVendedor();
  const navigate = useNavigate();

  const [venta, setVenta] = useState(null);

  useEffect(() => {
    async function fetchVenta() {
      try {
        const res = await fetch(`/api/ventas/${id}`, {
          headers: { 'X-Vendedor-Id': vendedorId }
        });
        const data = await res.json();
        setVenta(data);
      } catch (error) {
        console.error('Error al cargar venta:', error);
      }
    }
    if (vendedorId && id) fetchVenta();
  }, [vendedorId, id]);

  if (!venta) return <p>Cargando venta...</p>;

  return (
    <div className="container content">
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>⬅️ Volver</button>
      <h1>Detalle de Venta #{venta.codigo_pedido}</h1>

      <div className="ventaDetalle">
        <div>
          <strong>Cliente:</strong> {venta.nombre_cliente} ({venta.correo_cliente})
        </div>
        <div>
          <strong>Fecha:</strong> {new Date(venta.fecha_pedido).toLocaleDateString()}
        </div>
        <div>
          <strong>Total:</strong> ${venta.total_pedido}
        </div>
        <div>
          <strong>Estado:</strong> {venta.estado_pedido}
        </div>
        {venta.giftcard_aplicada && (
          <div>
            <strong>GiftCard Aplicada:</strong> {venta.giftcard_aplicada}
          </div>
        )}
      </div>

      <h2 style={{ marginTop: '2rem' }}>Productos vendidos</h2>

      <div className="productosVendidos">
        <div className="productosHeader">
          <span>Producto</span>
          <span>Cantidad</span>
          <span>Precio Unitario</span>
          <span>Subtotal</span>
        </div>

        {venta.productos?.map((prod, idx) => (
          <div key={idx} className="productosRow">
            <span>{prod.producto}</span>
            <span>{prod.cantidad}</span>
            <span>${prod.precio}</span>
            <span>${prod.subtotal}</span>
          </div>
        ))}

        {(!venta.productos || venta.productos.length === 0) && (
          <p>No se encontraron productos en esta venta.</p>
        )}
      </div>
    </div>
  );
}
