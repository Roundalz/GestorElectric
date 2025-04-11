// app.js
import cors from "cors";
import express from "express";
import testController from "./controllers/testController.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost", "http://frontend", "http://localhost:80"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // Permitir solicitudes desde el frontend
app.use(express.json()); // Habilitar JSON en requests
app.use("/api", testController);

// Rutas principales del orquestador
app.get("/", (req, res) => {
  res.send("Orquestador funcionando 🚀");
});

// Proxy de rutas hacia los microservicios
import autenticacionRouter from "./routes/autenticacion.js";
app.use("/api/auth", autenticacionRouter);

// Proxy de rutas hacia los microservicios
import portalRouter from "./routes/portal.js";
app.use("/api/portales", portalRouter);

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Orquestador corriendo en http://localhost:${PORT}`);
});

/////////////////////Anghelo/////////////////
import clienteRoutes from "./routes/clientes.js";
app.use("/api/clientes", clienteRoutes);

import planDePagosRoutes from "./routes/planDePagos.js";
app.use("/api/planes", planDePagosRoutes);

import vendedorRoutes from "./routes/vendedores.js";
app.use("/api/vendedores", vendedorRoutes);

import logsRoutes from "./routes/logs.js";
app.use("/api/logs", logsRoutes);
