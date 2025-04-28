import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Barcode from 'react-barcode';
import { QRCodeCanvas } from 'qrcode.react';
import { useVendedor } from '@context/vendedorContext';
import styles from './BarcodePrint.module.css';

const API_BASE = 'http://localhost:5000/api/inventario';
const PLACEHOLDER = 'https://via.placeholder.com/60';

export default function BarcodePrint() {
  const { vendedorId } = useVendedor();
  const [search, setSearch] = useState('');
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState('barcode');
  const [codes, setCodes] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!search || !vendedorId) return;
    try {
      let data;
      const headers = { 'X-Vendedor-Id': vendedorId }; // ✅ (nuevo) Headers

      if (/^\d+$/.test(search.trim())) {
        const res = await fetch(`${API_BASE}/productos/${search.trim()}`, { headers });
        if (!res.ok) throw new Error('No encontrado');
        data = await res.json();
      } else {
        const res = await fetch(`${API_BASE}/productos?name=${encodeURIComponent(search.trim())}`, { headers });
        const list = await res.json();
        if (!list.length) throw new Error('No encontrado');
        data = list[0];
      }
      setProduct(data);
      setCodes([]);
    } catch (err) {
      alert(err.message);
      setProduct(null);
      setCodes([]);
    }
  };

  const handleGenerate = () => {
    if (!product || quantity < 1) return;
    setCodes(
      Array.from({ length: quantity }, (_, i) => ({
        id: i,
        value: String(product.codigo_producto),
      }))
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Código o nombre"
          className={styles.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className={styles.button} onClick={handleSearch}>
          Buscar
        </button>
      </div>

      {product && (
        <div className={styles.preview} onClick={() => navigate(`/inventario/${product.codigo_producto}`)}>
          <img
            src={product.imagen_referencia_producto || PLACEHOLDER}
            alt={product.nombre_producto}
          />
          <div className={styles.info}>
            <p>{product.nombre_producto}</p>
            <p className={styles.code}>#{product.codigo_producto}</p>
          </div>
        </div>
      )}

      {product && (
        <div className={styles.options}>
          <div>
            <label>Cantidad:</label>
            <input
              type="number"
              min="1"
              className={styles.qtyInput}
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            />
          </div>
          <div>
            <label>Tipo:</label>
            <select
              className={styles.select}
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="barcode">Código de barras</option>
              <option value="qr">QR</option>
            </select>
          </div>
          <button className={styles.button} onClick={handleGenerate}>
            Generar
          </button>
        </div>
      )}

      {codes.length > 0 && (
        <div className={styles.printArea}>
          <button
            className={styles.printBtn}
            onClick={() => window.print()}
          >
            Imprimir
          </button>
          <div className={styles.codesGrid}>
            {codes.map(c => (
              <div key={c.id} className={styles.codeItem}>
                {type === 'barcode' ? (
                  <Barcode value={c.value} />
                ) : (
                  <QRCodeCanvas value={c.value} size={96} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}