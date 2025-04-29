// frontend/src/pages/Vendedor/PlanesPago.jsx
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PlanesPago.css';                 //  ←  NUEVO : estilos externos
import logoPP from '../assets/logo.png';   //  ←  logo pequeño “PP”

/* ─ helpers ────────────────────────────────────────────────────────────── */
const generarClave = () =>
  crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();

/* ─ componente ─────────────────────────────────────────────────────────── */
export default function PlanesPago() {
  const navigate                            = useNavigate();
  const [planes,   setPlanes]               = useState([]);
  const [selected, setSelected]             = useState(null);
  const [confirm,  setConfirm]              = useState(null);

  /* 1. recuperar datos del registro (se guardaron en Register.jsx) */
  const { formData = {} } =
    JSON.parse(sessionStorage.getItem('vendedorRegistro') || '{}');

  /* 2. obtener planes desde el backend */
  useEffect(() => {
    fetch('http://localhost:5000/api/planes')
      .then((r) => r.json())
      .then(setPlanes)
      .catch(console.error);
  }, []);

  /* 3. confirmar selección, crear vendedor y registrar pago */
  const handleConfirm = async () => {
    if (!selected) return;

    const clave_vendedor  = generarClave();
    const payloadVendedor = {
      ...formData,
      clave_vendedor,
      estado_vendedor: 'activo',
      PLANES_PAGO_codigo_plan: selected.codigo_plan
    };

    try {
      /* 3.1 crear vendedor */
      const rVend = await fetch(
        'http://localhost:5000/api/auth/register/vendedor',
        {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify(payloadVendedor)
        }
      );
      if (!rVend.ok) throw new Error(await rVend.text());
      const vendData          = await rVend.json();
      const codigo_vendedore  =
        vendData.codigo_vendedore || vendData.vendedor?.codigo_vendedore;

      /* 3.2 si el plan no es freemium registrar pago */
      let pagoOk = false;
      if (selected.nombre_plan.toLowerCase() !== 'freemium') {
        const pagoBody = {
          fecha_pago               : new Date().toISOString().slice(0, 10),
          monto_pago               : Number(selected.precio_m_s_a),
          estado_pago              : 'Completado',
          VENDEDOR_codigo_vendedore: codigo_vendedore
        };
        const rPago = await fetch('http://localhost:5000/api/pagos', {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify(pagoBody)
        });
        pagoOk = rPago.ok;
      }

      /* 3.3 mostrar confirmación y limpiar storage */
      setConfirm({
        plan          : selected.nombre_plan,
        pagoRegistrado: pagoOk,
        clave         : clave_vendedor
      });
      sessionStorage.removeItem('vendedorRegistro');
    } catch (err) {
      console.error(err);
      alert('Hubo un problema al registrar tu plan. Intenta de nuevo.');
    }
  };

  /* 4. pantalla de confirmación */
  if (confirm) {
    return (
      <div className="planes-confirm">
        <h2>¡Registro completado!</h2>

        <p>
          Plan seleccionado: <strong>{confirm.plan}</strong>
        </p>

        {confirm.pagoRegistrado
          ? <p>Pago registrado correctamente.</p>
          : <p>Has elegido el plan <strong>Freemium</strong>.</p>}

        <p>Tu clave de vendedor es:</p>

        <code className="planes-clave">{confirm.clave}</code>

        <Link to="/login" className="planes-link">Ir a iniciar sesión</Link>
      </div>
    );
  }

  /* 5. UI principal */
  return (
    <div className="planes-wrapper">
      <header className="planes-header">
        <img src={logoPP} alt="Logo plan" className="planes-logo" />
        <h1 className="planes-welcome">
          Bienvenido&nbsp;
          <span className="planes-company">“{formData.nombre_empresa ?? ''}”</span>
        </h1>
      </header>

      <h2 className="planes-subtitle">Selecciona un plan de vendedor</h2>

      <div className="planes-grid">
        {planes.map((pl) => (
          <label
            key={pl.codigo_plan}
            className={
              'planes-card' + (selected?.codigo_plan === pl.codigo_plan
                ? ' planes-card--active'
                : '')
            }
          >
            <input
              type="radio"
              name="plan"
              className="planes-radio"
              onChange={() => setSelected(pl)}
            />

            <h3 className="planes-name">{pl.nombre_plan}</h3>

            <p className="planes-price">
              ${Number(pl.precio_m_s_a).toFixed(2)}
            </p>

            {/* cálculo de duración en días: fecha_expiracion_plan – hoy */}
            {(() => (
  <ul className="planes-features">
    {/* Tipo de pago del plan (Mensual, Anual, Ilimitado, etc.) */}
    {pl.tipo_pago_plan && (
      <li>Tipo de pago: {pl.tipo_pago_plan}</li>
    )}

    {/* Duración en días si no es ilimitado */}
    {pl.tipo_pago_plan !== 'Ilimitado' && pl.duracion_dias && (
      <li>Duración: {pl.duracion_dias} días</li>
    )}

    {/* Descripción corta del plan */}
    {pl.descripcion && (
      <li>{pl.descripcion}</li>
    )}

    {/* Máximo de productos permitidos */}
    {pl.max_productos && (
      <li>Hasta {pl.max_productos.toLocaleString()} productos</li>
    )}

    {/* Comisión de venta */}
    {pl.comision_venta !== null && (
      <li>Comisión de venta: {pl.comision_venta}%</li>
    )}
  </ul>
))()}

          </label>
        ))}
      </div>

      <button
        className="planes-btn"
        disabled={!selected}
        onClick={handleConfirm}
      >
        Aceptar
      </button>

      <footer className="planes-footer">
        <Link to="/terms">Terms of Use</Link>&nbsp;|&nbsp;
        <Link to="/privacy">Privacy Policy</Link>
      </footer>
    </div>
  );
}
