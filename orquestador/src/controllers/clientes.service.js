const db = require("../database");

exports.createCliente = async (req, res) => {
  const { nombre_cliente, correo_cliente, telefono_cliente } = req.body;
  const result = await db.query(
    "INSERT INTO cliente (nombre_cliente, correo_cliente, telefono_cliente) VALUES ($1, $2, $3) RETURNING *",
    [nombre_cliente, correo_cliente, telefono_cliente]
  );
  res.json(result.rows[0]);
};
