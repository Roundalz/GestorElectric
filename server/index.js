// server/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// Rutas VALDIR
const productosRoutes = require('./routes/productos');
const clientesRoutes = require('./routes/clientes');
const carritoRoutes = require('./routes/carrito');

//RUTAS ALEJANDRO
const portalConfigRoutes = require('./routes/p_config');
const vendedorPortalRoutes = require('./routes/v_portal');


app.use('/api/productos', productosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/carrito', carritoRoutes);

app.use('/api/portales', portalConfigRoutes);
app.use('/api/portales', vendedorPortalRoutes);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
