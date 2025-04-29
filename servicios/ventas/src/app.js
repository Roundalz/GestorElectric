// app.js en la carpeta ventas/
import express from "express";
import dotenv from "dotenv";
import ventaRoutes from "./routes/ventaRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import cors from "cors";



dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

// Monta las rutas
app.use("/ventas", ventaRoutes);
app.use("/clientes", clienteRoutes);

app.get("/", (req, res) => {
  res.send("Servidor de Ventas funcionando 🚀");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor de Ventas corriendo en http://localhost:${PORT}`);
});
