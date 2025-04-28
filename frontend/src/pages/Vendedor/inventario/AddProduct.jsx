// frontend/src/pages/Vendedor/inventario/AddProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Plus } from 'lucide-react';
import { useVendedor } from '@context/vendedorContext';
import styles from './AddProduct.module.css';

const API_BASE = 'http://localhost:5000/api/inventario';
const MAX_CHARS = 8;

export default function AddProduct() {
  const navigate = useNavigate();
  const { vendedorId } = useVendedor();

  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    nombre_producto: '',
    tipo_producto: '',
    precio_unidad_producto: '',
    cantidad_disponible_producto: '',
    estado_producto: '',
    costo_producto: '',
    descuento_producto: '',
    calificacion_producto: '0',
    imagen_referencia_producto: ''
  });
  const [chars, setChars] = useState([{ nombre_caracteristica: '', descripcion_caracteristica: '' }]);
  const [images, setImages] = useState([{ primer_angulo: '', segundo_angulo: '', tercer_angulo: '', cuarto_angulo: '' }]);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    if (!vendedorId) return;
    fetch(`${API_BASE}/productos`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'X-Vendedor-Id': vendedorId }
    })
      .then(r => r.json())
      .then(data => {
        const unique = Array.from(new Set(data.map(p => p.tipo_producto)));
        setTypes(unique);
      })
      .catch(console.error);
  }, [vendedorId]);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const updateChar = (i, field, value) => {
    const updated = [...chars];
    updated[i][field] = value;
    setChars(updated);
  };

  const addChar = () => {
    if (chars.length >= MAX_CHARS) {
      setToast({ message: `Máximo ${MAX_CHARS} características`, type: 'error' });
      return;
    }
    setChars(c => [...c, { nombre_caracteristica: '', descripcion_caracteristica: '' }]);
  };

  const updateImg = (field, value) => {
    const updated = [...images];
    updated[0][field] = value;
    setImages(updated);
  };

  const validate = () => {
    if (limitReached) return false;
    for (const k in form) {
      if (!form[k]) {
        setToast({ message: 'Completa todos los campos', type: 'error' });
        return false;
      }
    }
    for (const c of chars) {
      if (!c.nombre_caracteristica || !c.descripcion_caracteristica) {
        setToast({ message: 'Llena todas las características', type: 'error' });
        return false;
      }
    }
    for (const img of images) {
      for (const k in img) {
        if (!img[k]) {
          setToast({ message: 'Llena todas las URLs de imágenes', type: 'error' });
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Vendedor-Id': vendedorId
        },
        body: JSON.stringify({
          ...form,
          caracteristicas: chars,
          imagenes: images
        })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Error al crear producto');
      setToast({ message: 'Producto creado', type: 'success' });
      setTimeout(() => navigate('/vendedor/inventario'), 1000);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (limitReached) {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Límite alcanzado</h2>
        <p>Actualiza tu plan para agregar más productos.</p>
        <button className={styles.saveBtn} onClick={() => navigate('/vendedor/inventario')}>← Volver</button>
      </div>
    );
  }

  return (
    <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <h2 className={styles.heading}>Agregar Producto</h2>

      {/* Formulario producto */}
      {/* (id="tipo-list") */}
      <div className={styles.section}>
        {Object.keys(form).map((field, idx) => (
          <div key={idx} className={styles.fieldGroup}>
            <label>{field.replace(/_/g, ' ')}</label>
            <input
              name={field}
              value={form[field]}
              onChange={handleForm}
              type={field.includes('precio') || field.includes('cantidad') || field.includes('costo') || field.includes('descuento') ? 'number' : 'text'}
              list={field === 'tipo_producto' ? 'tipo-list' : undefined}
              disabled={field === 'calificacion_producto'}
            />
          </div>
        ))}
        <datalist id="tipo-list">
          {types.map(t => <option key={t} value={t} />)}
        </datalist>
      </div>

      {/* Características */}
      <div className={styles.section}>
        <h3>Características</h3>
        {chars.map((c, i) => (
          <div key={i} className={styles.charRow}>
            <input placeholder="Nombre" value={c.nombre_caracteristica} onChange={e => updateChar(i, 'nombre_caracteristica', e.target.value)} />
            <input placeholder="Descripción" value={c.descripcion_caracteristica} onChange={e => updateChar(i, 'descripcion_caracteristica', e.target.value)} />
          </div>
        ))}
        <button className={styles.addBtn} onClick={addChar} disabled={chars.length >= MAX_CHARS}>
          <Plus size={16} /> Añadir característica
        </button>
      </div>

      {/* Imágenes */}
      <div className={styles.section}>
        <h3>Imágenes</h3>
        {['primer_angulo', 'segundo_angulo', 'tercer_angulo', 'cuarto_angulo'].map((fld, idx) => (
          <input
            key={idx}
            placeholder={fld.replace('_', ' ')}
            value={images[0][fld]}
            onChange={e => updateImg(fld, e.target.value)}
          />
        ))}
      </div>

      <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Producto'}
      </button>

      <AnimatePresence>
        {toast.message && (
          <motion.div className={`${styles.toast} ${styles[toast.type]}`} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }}>
            {toast.type === 'success' ? <CheckCircle /> : <XCircle />} {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
