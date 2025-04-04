// database.js
import pg from 'pg'; // Importar el paquete 'pg' como un módulo por defecto
import dotenv from 'dotenv'; // Importar dotenv para cargar las variables de entorno
import path from 'path'; // Para trabajar con rutas de archivos
import { fileURLToPath } from 'url'; // Para obtener la ruta del archivo

const { Pool } = pg; // Desestructuración para obtener el Pool desde el módulo pg
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde 'variables.env'
dotenv.config({ path: path.resolve(__dirname, 'variables.env') });

// Crear el pool de conexiones con los parámetros de conexión
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Comprobar la conexión a la base de datos
pool.connect()
  .then(client => {
    console.log("✅ Conexión exitosa a PostgreSQL");
    client.release();
  })
  .catch(err => {
    console.error("❌ Error de conexión a PostgreSQL:", err);
    process.exit(1); // Salir si no se puede conectar a la base de datos
  });

export default pool;
