import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// Configuración middleware
app.use(cors({
  origin: ['http://localhost', 'http://frontend'] // Permitir requests del frontend
}));
app.use(express.json());

// Configuración robusta de Pool
const pool = new Pool({
  user: process.env.DB_USER ,
  host: process.env.DB_HOST ,
  database: process.env.DB_NAME ,
  password: process.env.DB_PASSWORD ,
  port: parseInt(process.env.DB_PORT ),
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// En servicios/portal/src/app.js
app.get('/portales/:vendedorId/view', async (req, res) => {
  try {
    const vendedorId = req.params.vendedorId;
    
    // Verificación básica del ID
    if (!vendedorId || isNaN(vendedorId)) {
      return res.status(400).json({ error: 'ID de vendedor inválido' });
    }

    // Tu lógica de negocio aquí...
    const portalData = await obtenerDatosPortal(vendedorId);
    
    res.set('Content-Type', 'application/json');
    res.status(200).json(portalData);
  } catch (error) {
    console.error('Error en /portales/:vendedorId/view:', error);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`✅ Servicio Portal corriendo en http://localhost:${PORT}`);
  console.log(`📊 Estado DB: ${pool.totalCount > 0 ? 'Conectado' : 'Desconectado'}`);
});