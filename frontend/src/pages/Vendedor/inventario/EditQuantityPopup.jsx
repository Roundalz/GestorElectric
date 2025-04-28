// src/pages/Vendedor/inventario/EditQuantityPopup.jsx
import React, { useState } from 'react';
//import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useVendedor } from '@context/VendedorContext';
import styles from './EditQuantityPopup.module.css';

const API_BASE = 'http://localhost:5000/api/inventario';

export default function EditQuantityPopup({ productId, currentQuantity, onUpdate, onClose }) {
  const [operation, setOperation] = useState('add');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  const { vendedorId } = useVendedor();

  const newQuantity = operation === 'add'
    ? currentQuantity + amount
    : Math.max(0, currentQuantity - amount);

  const handleSave = async () => {
    if (amount <= 0 || !vendedorId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/productos/${productId}/cantidad`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Vendedor-Id': vendedorId, // ✅ Corregido aquí
          },
          body: JSON.stringify({ cantidad: newQuantity }),
        }
      );
      if (!res.ok) throw new Error('Error al actualizar cantidad');
      onUpdate(newQuantity);
      setToast(true);
      setTimeout(() => {
        setToast(false);
        onClose();
      }, 1200);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <motion.div
        className={styles.popup}
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <h3 className={styles.title}>Ajustar Cantidad</h3>

        <div className={styles.controls}>
          <select
            className={styles.operationSelect}
            value={operation}
            onChange={e => setOperation(e.target.value)}
            disabled={loading}
          >
            <option value="add">Agregar</option>
            <option value="subtract">Restar</option>
          </select>

          <input
            type="number"
            className={styles.input}
            min="0"
            value={amount}
            onChange={e => setAmount(Math.max(0, Number(e.target.value)))}
            disabled={loading}
          />

          <div className={styles.preview}>
            Nueva cantidad: <strong>{newQuantity}</strong>
          </div>
        </div>

        <motion.button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={loading || amount <= 0}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </motion.button>

        <AnimatePresence>
          {toast && (
            <motion.div
              className={styles.toast}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle size={16} /> Cantidad actualizada
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}