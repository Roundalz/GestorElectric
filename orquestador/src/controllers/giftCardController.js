import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'gestor_nuevo',
  port: parseInt(process.env.DB_PORT) || 5432
});

// En giftCardController.js, modifica getGiftCardsByVendedor
export const getGiftCardsByVendedor = async (req, res) => {
    try {
      const vendedorId = parseInt(req.params.vendedorId);
      
      const result = await pool.query(
        `SELECT 
          codigo_gift_Card as "codigo_gift_Card",
          clave_gift_card as "clave_gift_card",
          fecha_expiracion_gift_card as "fecha_expiracion_gift_card",
          porcentaje_gift_card as "porcentaje_gift_card",
          estado_gift_card as "estado_gift_card",
          VENDEDOR_codigo_vendedore as "VENDEDOR_codigo_vendedore"
         FROM GIFT_CARDS 
         WHERE VENDEDOR_codigo_vendedore = $1
         ORDER BY fecha_expiracion_gift_card DESC`,
        [vendedorId]
      );
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error en getGiftCardsByVendedor:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener gift cards del vendedor'
      });
    }
  };

export const createGiftCard = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { 
      clave_gift_card, 
      fecha_expiracion_gift_card, 
      porcentaje_gift_card, 
      estado_gift_card,
      vendedorId 
    } = req.body;

    await client.query('BEGIN');

    // Verificar si el código ya existe
    const checkResult = await client.query(
      `SELECT 1 FROM GIFT_CARDS WHERE clave_gift_card = $1`,
      [clave_gift_card]
    );

    if (checkResult.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: 'El código de gift card ya existe'
      });
    }

    // Insertar nueva gift card
    const result = await client.query(
      `INSERT INTO GIFT_CARDS (
        clave_gift_card,
        fecha_expiracion_gift_card,
        porcentaje_gift_card,
        estado_gift_card,
        VENDEDOR_codigo_vendedore
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        clave_gift_card,
        fecha_expiracion_gift_card,
        porcentaje_gift_card,
        estado_gift_card,
        vendedorId
      ]
    );

    await client.query('COMMIT');
    
    res.json({
      success: true,
      giftCard: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en createGiftCard:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al crear gift card'
    });
  } finally {
    client.release();
  }
};

// En giftCardController.js, modifica updateGiftCard
export const updateGiftCard = async (req, res) => {
    const client = await pool.connect();
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID debe ser un número' });
      }
  
      const { 
        clave_gift_card, 
        fecha_expiracion_gift_card, 
        porcentaje_gift_card, 
        estado_gift_card,
        vendedorId 
      } = req.body;
  
      console.log('Datos recibidos para actualizar:', {
        id,
        clave_gift_card,
        fecha_expiracion_gift_card,
        porcentaje_gift_card,
        estado_gift_card,
        vendedorId
      });
  
      await client.query('BEGIN');
  
      // Verificar si la gift card existe
      const checkResult = await client.query(
        `SELECT 1 FROM GIFT_CARDS WHERE codigo_gift_Card = $1`,
        [id]
      );
  
      if (checkResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          error: 'Gift card no encontrada'
        });
      }
  
      // Verificar que pertenece al vendedor
      const ownerCheck = await client.query(
        `SELECT 1 FROM GIFT_CARDS WHERE codigo_gift_Card = $1 AND VENDEDOR_codigo_vendedore = $2`,
        [id, vendedorId]
      );
  
      if (ownerCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(403).json({
          success: false,
          error: 'La gift card no pertenece a este vendedor'
        });
      }
  
      // Actualizar gift card
      const result = await client.query(
        `UPDATE GIFT_CARDS SET
          clave_gift_card = $1,
          fecha_expiracion_gift_card = $2,
          porcentaje_gift_card = $3,
          estado_gift_card = $4
         WHERE codigo_gift_Card = $5
         RETURNING *`,
        [
          clave_gift_card,
          fecha_expiracion_gift_card,
          porcentaje_gift_card,
          estado_gift_card,
          id
        ]
      );
  
      await client.query('COMMIT');
      
      res.json({
        success: true,
        giftCard: result.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error detallado en updateGiftCard:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      res.status(500).json({ 
        success: false,
        error: 'Error al actualizar gift card',
        details: error.message
      });
    } finally {
      client.release();
    }
  };

export const deleteGiftCard = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const id = parseInt(req.params.id);

    await client.query('BEGIN');

    // Verificar si la gift card existe
    const checkResult = await client.query(
      `SELECT 1 FROM GIFT_CARDS WHERE codigo_gift_Card = $1`,
      [id]
    );

    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'Gift card no encontrada'
      });
    }

    // Eliminar gift card
    await client.query(
      `DELETE FROM GIFT_CARDS WHERE codigo_gift_Card = $1`,
      [id]
    );

    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: 'Gift card eliminada correctamente'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en deleteGiftCard:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al eliminar gift card'
    });
  } finally {
    client.release();
  }
};