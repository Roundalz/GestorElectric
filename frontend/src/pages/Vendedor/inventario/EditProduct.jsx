// src/pages/Vendedor/inventario/EditProduct.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useVendedor } from '@context/vendedorContext';
import styles from './EditProduct.module.css';

const API_BASE = 'http://localhost:5000/api/inventario';
const MAX_CHARS = 8;

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vendedorId } = useVendedor();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    nombre_producto: '',
    tipo_producto: '',
    precio_unidad_producto: '',
    cantidad_disponible_producto: '',
    estado_producto: '',
    costo_producto: '',
    descuento_producto: '',
  });
  const [chars, setChars] = useState([]);
  const [images, setImages] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!vendedorId) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/productos/${id}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'X-Vendedor-Id': vendedorId 
          }
        });
        if (!res.ok) throw new Error('No se pudo cargar');
        const data = await res.json();
        setProduct(data);
        setForm({
          nombre_producto: data.nombre_producto,
          tipo_producto: data.tipo_producto,
          precio_unidad_producto: data.precio_unidad_producto,
          cantidad_disponible_producto: data.cantidad_disponible_producto,
          estado_producto: data.estado_producto,
          costo_producto: data.costo_producto,
          descuento_producto: data.descuento_producto,
        });
        setChars(data.caracteristicas || []);
        setImages(data.imagenes.length
          ? data.imagenes.map(img => ({
              primer_angulo: img.primer_angulo,
              segundo_angulo: img.segundo_angulo,
              tercer_angulo: img.tercer_angulo,
              cuarto_angulo: img.cuarto_angulo,
            }))
          : [{ primer_angulo: '', segundo_angulo: '', tercer_angulo: '', cuarto_angulo: '' }]
        );
      } catch {
        setToast({ message: 'No se pudo cargar el producto', type: 'error' });
      }
    };
    fetchProduct();
  }, [id, vendedorId]);

  const handleForm = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const updateChar = (i, field, value) => {
    const copy = [...chars];
    copy[i][field] = value;
    setChars(copy);
  };

  const addChar = () => {
    if (chars.length >= MAX_CHARS) {
      return setToast({ message: `Máximo ${MAX_CHARS} características`, type: 'error' });
    }
    setChars(c => [...c, { nombre_caracteristica:'', descripcion_caracteristica:'' }]);
  };

  const delChar = i => setChars(c => c.filter((_, j) => j !== i));

  const updateImg = (i, field, value) => {
    const copy = [...images];
    copy[i][field] = value;
    setImages(copy);
  };

  const validate = () => {
    for (const key in form) {
      if (form[key] === '' || form[key] == null) {
        setToast({ message: 'Rellena todos los campos del producto', type: 'error' });
        return false;
      }
    }
    for (let c of chars) {
      if (!c.nombre_caracteristica || !c.descripcion_caracteristica) {
        setToast({ message: 'Completa todas las características', type: 'error' });
        return false;
      }
    }
    for (let img of images) {
      for (let f of ['primer_angulo','segundo_angulo','tercer_angulo','cuarto_angulo']) {
        if (img[f] === '') {
          setToast({ message: 'Completa todas las imágenes', type: 'error' });
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate() || !vendedorId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Vendedor-Id': vendedorId
        },
        body: JSON.stringify({ ...form, caracteristicas: chars, imagenes: images })
      });
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || 'Error al guardar');
      setToast({ message: 'Guardado con éxito', type: 'success' });
      setTimeout(() => navigate('/vendedor/inventario'), 1000);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p className={styles.loading}>Cargando…</p>;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <button className={styles.back} onClick={() => navigate('/vendedor/inventario')}>
        ← Volver
      </button>

      {/* Formulario de edición */}
      <div className={styles.section}>
        {[
          { label: 'Nombre', name: 'nombre_producto' },
          { label: 'Tipo', name: 'tipo_producto' },
          { label: 'Precio', name: 'precio_unidad_producto', type: 'number' },
          { label: 'Cantidad', name: 'cantidad_disponible_producto', type: 'number' },
          { label: 'Estado', name: 'estado_producto' },
          { label: 'Costo', name: 'costo_producto', type: 'number' },
          { label: 'Descuento %', name: 'descuento_producto', type: 'number' },
        ].map(({ label, name, type = 'text' }) => (
          <React.Fragment key={name}>
            <label>{label}</label>
            <input type={type} name={name} value={form[name]} onChange={handleForm} />
          </React.Fragment>
        ))}
      </div>

      {/* Características */}
      <div className={styles.section}>
        <h3>Características ({chars.length}/{MAX_CHARS})</h3>
        {chars.map((c, i) => (
          <div className={styles.charRow} key={i}>
            <input className={styles.charInput} placeholder="Nombre" value={c.nombre_caracteristica} onChange={e => updateChar(i, 'nombre_caracteristica', e.target.value)} />
            <input className={styles.charInput} placeholder="Descripción" value={c.descripcion_caracteristica} onChange={e => updateChar(i, 'descripcion_caracteristica', e.target.value)} />
            <button disabled={loading} onClick={() => delChar(i)} className={styles.delChar}><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={addChar} className={styles.addChar} disabled={chars.length >= MAX_CHARS}>
          <Plus size={16} /> Añadir característica
        </button>
      </div>

      {/* Imágenes */}
      <div className={styles.section}>
        <h3>Imágenes</h3>
        {images.map((img, i) => (
          <div className={styles.imgRow} key={i}>
            {['primer_angulo', 'segundo_angulo', 'tercer_angulo', 'cuarto_angulo'].map(fld => (
              <input
                key={fld}
                className={styles.imgInput}
                placeholder={fld.replace('_', ' ')}
                value={img[fld]}
                onChange={e => updateImg(i, fld, e.target.value)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Botón Guardar */}
      <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>

      {/* Toast */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            className={`${styles.toast} ${styles[toast.type]}`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {toast.type === 'success' ? <CheckCircle /> : <XCircle />} {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
