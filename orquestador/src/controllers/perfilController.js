// orquestador/src/controllers/PerfilController.js
import pool from '../database.js';

// Actualizar perfil de un cliente
export const updateClienteProfile = async (req, res) => {
  const { id } = req.params; // id corresponde a codigo_cliente
  const { nombre_cliente, telefono_cliente, cumpleanos_cliente, foto_perfil_cliente } = req.body;

  try {
    const result = await pool.query(
      `UPDATE CLIENTE 
       SET nombre_cliente = $1, telefono_cliente = $2, cumpleanos_cliente = $3, foto_perfil_cliente = $4 
       WHERE codigo_cliente = $5 
       RETURNING *`,
      [nombre_cliente, telefono_cliente, cumpleanos_cliente, foto_perfil_cliente, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar perfil del cliente:", error);
    res.status(500).json({ error: "Error al actualizar perfil del cliente" });
  }
};

// Actualizar perfil de un vendedor
export const updateVendedorProfile = async (req, res) => {
  const { id } = req.params; // id corresponde a codigo_vendedore
  const { 
    nombre_vendedor, 
    telefono_vendedor, 
    nombre_empresa, 
    tipo_empresa, 
    logo_empresa, 
    correo_empresa, 
    telefono_empresa, 
    pais_empresa, 
    ciudad_empresa, 
    direccion_empresa, 
    banner_empresa 
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE VENDEDOR 
       SET 
         nombre_vendedor = $1,
         telefono_vendedor = $2,
         nombre_empresa = $3,
         tipo_empresa = $4,
         logo_empresa = $5,
         correo_empresa = $6,
         telefono_empresa = $7,
         pais_empresa = $8,
         ciudad_empresa = $9,
         direccion_empresa = $10,
         banner_empresa = $11
       WHERE codigo_vendedore = $12
       RETURNING *`,
      [
        nombre_vendedor,
        telefono_vendedor,
        nombre_empresa,
        tipo_empresa,
        logo_empresa,
        correo_empresa,
        telefono_empresa,
        pais_empresa,
        ciudad_empresa,
        direccion_empresa,
        banner_empresa,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vendedor no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar perfil del vendedor:", error);
    res.status(500).json({ error: "Error al actualizar perfil del vendedor" });
  }
};
