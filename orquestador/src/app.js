import cors from "cors";

import express from "express";
import testController from "./controllers/testController.js";
import autenticacionRouter from "./routes/autenticacion.js";
import clientes from "./routes/clientesRoutes.js";
import logsRoutes from "./routes/LogsRoutes.js"; // <-- Asegúrate de importar las rutas de logs
import planPagosRoutes from "./routes/planPagosRoutes.js";
import servicioRoutes from "./routes/servicioRoutes.js";
import vendedorRoutes from "./routes/vendedorRoutes.js";

const app = express();

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Habilitar JSON en requests

// Rutas de prueba (o cualquier endpoint de prueba)
app.use("/api", testController);

// Rutas de CRUD para LOGS
app.use("/api/logs", logsRoutes); // <-- Monta tus rutas de logs aquí

// Luego de otros `app.use`, monta esto:
app.use("/api/planes_pago", planPagosRoutes);

// Rutas de CRUD para VENDEDOR
app.use("/api/vendedores", vendedorRoutes);

// Rutas de CRUD para SERVICIO
app.use("/api/servicios", servicioRoutes);

// Rutas de CRUD para CLIENTES
app.use("/api/clientes", clientes); // <-- monta tus rutas de clientes aquí

// Proxy de rutas hacia los microservicios
app.use("/api/auth", autenticacionRouter);

// Rutas principales del orquestador
app.get("/", (req, res) => {
  res.send("Orquestador funcionando 🚀");
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Orquestador corriendo en http://localhost:${PORT}`);
});
