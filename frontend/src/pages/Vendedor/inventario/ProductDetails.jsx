// src/pages/Vendedor/inventario/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVendedor } from '@context/VendedorContext';
import Barcode from 'react-barcode';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Plus, CheckCircle } from 'lucide-react';
import EditQuantityPopup from './EditQuantityPopup';
import styles from './ProductDetails.module.css';

const API_BASE = 'http://localhost:5000/api/inventario';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vendedorId } = useVendedor();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [showQtyPopup, setShowQtyPopup] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!vendedorId) return;
    fetch(`${API_BASE}/productos/${id}`, {
      headers: {
        'X-Vendedor-Id': vendedorId, // ✅ Header correcto
      }
    })
      .then(res => res.ok ? res.json() : Promise.reject('Error al cargar producto'))
      .then(data => {
        setProduct(data);
        const angles = [];
        data.imagenes?.forEach(img => {
          ['primer_angulo', 'segundo_angulo', 'tercer_angulo', 'cuarto_angulo']
            .forEach(key => img[key] && angles.push(img[key]));
        });
        const all = [data.imagen_referencia_producto, ...angles].filter(Boolean);
        const unique = Array.from(new Set(all));
        setThumbnails(unique);
        setMainImage(data.imagen_referencia_producto || unique[0] || '');
      })
      .catch(console.error);
  }, [id, vendedorId]);

  const handleDelete = () => setShowConfirm(true);

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Vendedor-Id': vendedorId // ✅ Header correcto
        }
      });
      if (!res.ok) throw new Error('Error al eliminar producto');
      setShowConfirm(false);
      setShowToast(true);
      setTimeout(() => navigate('/vendedor/inventario'), 1500);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!product) return <p className={styles.loading}>Cargando producto…</p>;

  return (
    <>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button className={styles.backButton} onClick={() => navigate('/vendedor/inventario')}>
          ← Volver
        </button>

        <div className={styles.main}>
          <div className={styles.left}>
            <motion.img
              key={mainImage}
              src={mainImage}
              alt={product.nombre_producto}
              className={styles.mainImage}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />

            <div className={styles.thumbs}>
              {thumbnails.map((src, idx) => (
                <motion.img
                  key={idx}
                  src={src}
                  alt={`Ángulo ${idx + 1}`}
                  className={`${styles.thumb} ${src === mainImage ? styles.activeThumb : ''}`}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setMainImage(src)}
                />
              ))}
            </div>

            <div className={styles.codes}>
              <div className={styles.barcode}>
                <Barcode value={String(product.codigo_producto)} />
              </div>
              <div className={styles.qrcode}>
                <QRCodeCanvas value={String(product.codigo_producto)} size={96} />
              </div>
            </div>
          </div>

          <div className={styles.right}>
            <h2 className={styles.title}>{product.nombre_producto}</h2>
            {[
              'tipo_producto', 'precio_unidad_producto', 'cantidad_disponible_producto',
              'estado_producto', 'costo_producto', 'descuento_producto', 'calificacion_producto'
            ].map((field, i) => (
              <p key={i}>
                <strong>{field.replace(/_/g, ' ')}:</strong> {product[field]}
                {(field.includes('precio') || field === 'costo_producto') ? ' $' : ''}
              </p>
            ))}

            <div className={styles.characteristics}>
              <h3>Características</h3>
              <ul>
                {product.caracteristicas.map(c => (
                  <li key={c.codigo_caracteristica}>
                    <strong>{c.nombre_caracteristica}:</strong> {c.descripcion_caracteristica}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.actions}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setShowQtyPopup(true)}>
                <Plus size={16} /> Ajustar Cantidad
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => navigate(`/inventario/editar/${id}`)}>
                <Edit2 size={16} /> Editar
              </button>
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDelete}>
                <Trash2 size={16} /> Eliminar
              </button>
            </div>
          </div>
        </div>

        {showQtyPopup && (
          <EditQuantityPopup
            productId={id}
            currentQuantity={product.cantidad_disponible_producto}
            onUpdate={qty => setProduct(prev => ({ ...prev, cantidad_disponible_producto: qty }))}
            onClose={() => setShowQtyPopup(false)}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div className={styles.confirmOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.confirmModal} initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <p>¿Eliminar este producto?</p>
              <div className={styles.confirmButtons}>
                <button className={styles.btn} onClick={() => setShowConfirm(false)}>Cancelar</button>
                <button className={`${styles.btn} ${styles.btnDanger}`} onClick={confirmDelete}>
                  Sí, eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <motion.div className={styles.toast} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}>
            <CheckCircle size={20} /> Producto eliminado
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
