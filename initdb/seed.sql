-- Insertar planes de pago
INSERT INTO PLANES_PAGO (codigo_plan, nombre_plan, descripcion, precio_m_s_a, comision_venta, max_productos, fecha_expiracion_plan) VALUES
(1, 'Plan Básico (50 productos)', 'Incluye portal básico sin publicidad', 49.99, 5.00, 50, '2025-12-31'),
(2, 'Plan Estándar (200 productos)', 'Incluye analítica básica y diseño mejorado', 99.99, 3.50, 200, '2025-12-31'),
(3, 'Plan Premium (1000 productos)', 'Incluye todas las características sin publicidad', 199.99, 2.00, 1000, '2025-12-31');

-- Insertar vendedores (5 vendedores con los correos proporcionados)
INSERT INTO VENDEDOR (codigo_vendedore, nombre_vendedor, correo_vendedor, telefono_vendedor, clave_vendedor, estado_vendedor, nombre_empresa, tipo_empresa, logo_empresa, correo_empresa, telefono_empresa, pais_empresa, ciudad_empresa, direccion_empresa, banner_empresa, PLANES_PAGO_codigo_plan) VALUES
(1, 'Mayra Valdez', 'mayra.valdez.t@ucb.edu.bo', '59171234567', '$2a$10$xJwL5v5Jz5U6Zz5U6Zz5Ue', 'Activo', 'ElectroValdez', 'Distribuidor', 'logos/electrovaldez.jpg', 'ventas@electrovaldez.com', '59122223333', 'Bolivia', 'La Paz', 'Av. Arce 1234', 'banners/electrovaldez_banner.jpg', 2),
(2, 'Ronald Narvaez', 'ronald.narvaez@ucb.edu.bo', '59171234568', '$2a$10$xJwL5v5Jz5U6Zz5U6Zz5Ue', 'Activo', 'Iluminación Narvaez', 'Fabricante', 'logos/iluminacion_narvaez.jpg', 'info@iluminacionnarvaez.com', '59122223334', 'Bolivia', 'Santa Cruz', 'Av. San Martín 567', 'banners/iluminacion_narvaez_banner.jpg', 3),
(3, 'Anghelo Pecho', 'anghelo.pecho@ucb.edu.bo', '59171234569', '$2a$10$xJwL5v5Jz5U6Zz5U6Zz5Ue', 'Bloqueado', 'Pecho Electric', 'Mayorista', 'logos/pecho_electric.jpg', 'contacto@pechoelectric.com', '59122223335', 'Bolivia', 'Cochabamba', 'Calle Jordán 890', 'banners/pecho_electric_banner.jpg', 1),
(4, 'Valdir Flores', 'valdir.flores@ucb.edu.bo', '59171234570', '$2a$10$xJwL5v5Jz5U6Zz5U6Zz5Ue', 'Inactivo', 'Flores Iluminación', 'Minorista', 'logos/flores_iluminacion.jpg', 'ventas@floresiluminacion.com', '59122223336', 'Bolivia', 'Sucre', 'Calle Bustillos 234', 'banners/flores_iluminacion_banner.jpg', 1),
(5, 'Alejandro Mollinedo', 'alejandro.mollinedo@ucb.edu.bo', '59171234571', '$2a$10$xJwL5v5Jz5U6Zz5U6Zz5Ue', 'Activo', 'MolliElectric', 'Distribuidor', 'logos/mollielectric.jpg', 'info@mollielectric.com', '59122223337', 'Bolivia', 'Tarija', 'Av. Las Américas 456', 'banners/mollielectric_banner.jpg', 2);

-- Insertar portales para cada vendedor
INSERT INTO PORTAL (codigo_portal, publicidad_portal, VENDEDOR_codigo_vendedore, estado_portal) VALUES
('electrovaldez', true, 1, 'Activo'),
('iluminacion-narvaez', false, 2, 'Activo'),
('pecho-electric', true, 3, 'Bloqueado'),
('flores-iluminacion', false, 4, 'Inactivo'),
('mollielectric', true, 5, 'Activo');

-- Insertar temas portal
INSERT INTO TEMAS_PORTAL (codigo_tema, nombre_tema, descripcion_tema, es_predeterminado, datos_config, fecha_creacion, creado_por) VALUES
(1, 'Clásico', 'Tema clásico con colores neutros', true, '{"colorPrincipal": "#2c3e50", "colorSecundario": "#3498db", "colorFondo": "#ecf0f1"}', '2024-01-01 00:00:00', 1),
(2, 'Moderno', 'Tema moderno con diseño minimalista', false, '{"colorPrincipal": "#e74c3c", "colorSecundario": "#f39c12", "colorFondo": "#ffffff"}', '2024-01-15 00:00:00', 2),
(3, 'Oscuro', 'Tema oscuro para ahorro de energía', false, '{"colorPrincipal": "#1abc9c", "colorSecundario": "#2ecc71", "colorFondo": "#34495e"}', '2024-02-01 00:00:00', 3),
(4, 'Vibrante', 'Tema con colores llamativos', false, '{"colorPrincipal": "#9b59b6", "colorSecundario": "#e67e22", "colorFondo": "#f1c40f"}', '2024-02-15 00:00:00', 4),
(5, 'Profesional', 'Tema profesional para empresas', false, '{"colorPrincipal": "#34495e", "colorSecundario": "#7f8c8d", "colorFondo": "#ffffff"}', '2024-03-01 00:00:00', 5);

-- Insertar configuración de portales
INSERT INTO PORTAL_CONFIGURACION (codigo_portal_configuracion, PORTAL_codigo_portal, estilo_titulo, tema_seleccionado, color_principal, color_secundario, color_fondo, fuente_principal, disposicion_productos, productos_por_fila, mostrar_precios, mostrar_valoraciones, estilo_header, mostrar_busqueda, mostrar_categorias, estilos_productos, mostrar_banner, logo_personalizado, banner_personalizado, fecha_actualizacion) VALUES
(1, 'electrovaldez', 'bold 24px Arial', 'Moderno', '#e74c3c', '#f39c12', '#ffffff', 'Arial', 'grid', 4, true, true, 'fixed', true, true, 'card', true, 'logos/electrovaldez_custom.jpg', 'banners/electrovaldez_custom.jpg', '2024-04-01 10:00:00'),
(2, 'iluminacion-narvaez', 'italic 28px Roboto', 'Oscuro', '#1abc9c', '#2ecc71', '#34495e', 'Roboto', 'list', 1, true, false, 'sticky', true, false, 'minimal', false, 'logos/iluminacion_narvaez_custom.jpg', 'banners/iluminacion_narvaez_custom.jpg', '2024-04-02 11:00:00'),
(3, 'pecho-electric', 'normal 22px Open Sans', 'Clásico', '#2c3e50', '#3498db', '#ecf0f1', 'Open Sans', 'grid', 3, false, true, 'static', false, true, 'detailed', true, 'logos/pecho_electric_custom.jpg', 'banners/pecho_electric_custom.jpg', '2024-04-03 12:00:00'),
(4, 'flores-iluminacion', 'bold 26px Montserrat', 'Vibrante', '#9b59b6', '#e67e22', '#f1c40f', 'Montserrat', 'grid', 2, true, true, 'fixed', true, true, 'card', false, 'logos/flores_iluminacion_custom.jpg', 'banners/flores_iluminacion_custom.jpg', '2024-04-04 13:00:00'),
(5, 'mollielectric', 'normal 20px Lato', 'Profesional', '#34495e', '#7f8c8d', '#ffffff', 'Lato', 'grid', 5, true, false, 'sticky', false, false, 'minimal', true, 'logos/mollielectric_custom.jpg', 'banners/mollielectric_custom.jpg', '2024-04-05 14:00:00');

-- Insertar productos para cada vendedor (5 productos por vendedor)
-- Vendedor 1: Mayra Valdez
INSERT INTO PRODUCTOS (codigo_producto, nombre_producto, tipo_producto, precio_unidad_producto, cantidad_disponible_producto, imagen_referencia_producto, estado_producto, calificacion_producto, costo_producto, descuento_producto, VENDEDOR_codigo_vendedore, PORTAL_codigo_portal) VALUES
(1, 'Foco LED 9W', 'Iluminación', 25, 100, 'productos/foco_led_9w.jpg', 'Disponible', 4, 15, 0, 1, 'electrovaldez'),
(2, 'Cable eléctrico 2.5mm 100m', 'Cables', 120, 50, 'productos/cable_2.5mm.jpg', 'Disponible', 5, 80, 10, 1, 'electrovaldez'),
(3, 'Interruptor simple', 'Accesorios eléctricos', 15, 200, 'productos/interruptor_simple.jpg', 'Disponible', 4, 8, 0, 1, 'electrovaldez'),
(4, 'Tubo LED 18W', 'Iluminación', 45, 75, 'productos/tubo_led_18w.jpg', 'Disponible', 5, 30, 5, 1, 'electrovaldez'),
(5, 'Portalámparas E27', 'Accesorios eléctricos', 12, 150, 'productos/portalampares_e27.jpg', 'Disponible', 3, 6, 0, 1, 'electrovaldez');

-- Vendedor 2: Ronald Narvaez
INSERT INTO PRODUCTOS (codigo_producto, nombre_producto, tipo_producto, precio_unidad_producto, cantidad_disponible_producto, imagen_referencia_producto, estado_producto, calificacion_producto, costo_producto, descuento_producto, VENDEDOR_codigo_vendedore, PORTAL_codigo_portal) VALUES
(6, 'Lámpara de techo moderna', 'Iluminación', 180, 30, 'productos/lampara_techo_moderna.jpg', 'Disponible', 5, 120, 15, 2, 'iluminacion-narvaez'),
(7, 'Foco inteligente RGB', 'Iluminación inteligente', 95, 40, 'productos/foco_inteligente_rgb.jpg', 'Disponible', 4, 60, 0, 2, 'iluminacion-narvaez'),
(8, 'Panel LED 30x30', 'Iluminación', 150, 25, 'productos/panel_led_30x30.jpg', 'Disponible', 5, 100, 20, 2, 'iluminacion-narvaez'),
(9, 'Lámpara de pie', 'Iluminación', 220, 15, 'productos/lampara_pie.jpg', 'Disponible', 4, 150, 0, 2, 'iluminacion-narvaez'),
(10, 'Foco halógeno 50W', 'Iluminación', 35, 60, 'productos/foco_halogeno_50w.jpg', 'Agotado', 3, 20, 5, 2, 'iluminacion-narvaez');

-- Vendedor 3: Anghelo Pecho
INSERT INTO PRODUCTOS (codigo_producto, nombre_producto, tipo_producto, precio_unidad_producto, cantidad_disponible_producto, imagen_referencia_producto, estado_producto, calificacion_producto, costo_producto, descuento_producto, VENDEDOR_codigo_vendedore, PORTAL_codigo_portal) VALUES
(11, 'Caja de conexión 10x10', 'Accesorios eléctricos', 18, 80, 'productos/caja_conexion_10x10.jpg', 'Disponible', 4, 10, 0, 3, 'pecho-electric'),
(12, 'Breaker 20A', 'Protección eléctrica', 45, 50, 'productos/breaker_20a.jpg', 'Disponible', 5, 30, 5, 3, 'pecho-electric'),
(13, 'Cable THHN 14AWG', 'Cables', 85, 40, 'productos/cable_thhn_14awg.jpg', 'Disponible', 4, 55, 0, 3, 'pecho-electric'),
(14, 'Toma corriente doble', 'Accesorios eléctricos', 22, 100, 'productos/toma_corriente_doble.jpg', 'Disponible', 3, 12, 0, 3, 'pecho-electric'),
(15, 'Cinta aislante negra', 'Accesorios eléctricos', 8, 200, 'productos/cinta_aislante_negra.jpg', 'Agotado', 4, 3, 0, 3, 'pecho-electric');

-- Vendedor 4: Valdir Flores
INSERT INTO PRODUCTOS (codigo_producto, nombre_producto, tipo_producto, precio_unidad_producto, cantidad_disponible_producto, imagen_referencia_producto, estado_producto, calificacion_producto, costo_producto, descuento_producto, VENDEDOR_codigo_vendedore, PORTAL_codigo_portal) VALUES
(16, 'Lámpara vintage', 'Iluminación decorativa', 150, 20, 'productos/lampara_vintage.jpg', 'Disponible', 5, 90, 10, 4, 'flores-iluminacion'),
(17, 'Foco ahorrador 15W', 'Iluminación', 30, 60, 'productos/foco_ahorrador_15w.jpg', 'Disponible', 4, 18, 0, 4, 'flores-iluminacion'),
(18, 'Luz emergencia LED', 'Iluminación de emergencia', 120, 25, 'productos/luz_emergencia_led.jpg', 'Disponible', 3, 80, 15, 4, 'flores-iluminacion'),
(19, 'Reflector LED 50W', 'Iluminación exterior', 180, 15, 'productos/reflector_led_50w.jpg', 'Disponible', 5, 120, 0, 4, 'flores-iluminacion'),
(20, 'Lámpara de escritorio', 'Iluminación', 75, 30, 'productos/lampara_escritorio.jpg', 'Agotado', 4, 45, 5, 4, 'flores-iluminacion');

-- Vendedor 5: Alejandro Mollinedo
INSERT INTO PRODUCTOS (codigo_producto, nombre_producto, tipo_producto, precio_unidad_producto, cantidad_disponible_producto, imagen_referencia_producto, estado_producto, calificacion_producto, costo_producto, descuento_producto, VENDEDOR_codigo_vendedore, PORTAL_codigo_portal) VALUES
(21, 'Regleta 6 salidas', 'Accesorios eléctricos', 35, 70, 'productos/regleta_6_salidas.jpg', 'Disponible', 4, 20, 0, 5, 'mollielectric'),
(22, 'Transformador 220V a 110V', 'Equipos eléctricos', 250, 15, 'productos/transformador_220v_110v.jpg', 'Disponible', 5, 180, 20, 5, 'mollielectric'),
(23, 'Sensor de movimiento', 'Automatización', 65, 30, 'productos/sensor_movimiento.jpg', 'Disponible', 4, 40, 0, 5, 'mollielectric'),
(24, 'Base para foco GU10', 'Accesorios eléctricos', 18, 90, 'productos/base_foco_gu10.jpg', 'Disponible', 3, 10, 5, 5, 'mollielectric'),
(25, 'Cable coaxial RG6', 'Cables', 55, 40, 'productos/cable_coaxial_rg6.jpg', 'Agotado', 4, 35, 0, 5, 'mollielectric');

-- Insertar imágenes de productos
INSERT INTO IMG_PRODUCTO (codigo_img_producto, primer_angulo, segundo_angulo, tercer_angulo, cuarto_angulo, PRODUCTOS_codigo_producto) VALUES
('img1', 'productos/foco_led_9w_1.jpg', 'productos/foco_led_9w_2.jpg', 'productos/foco_led_9w_3.jpg', 'productos/foco_led_9w_4.jpg', 1),
('img2', 'productos/cable_2.5mm_1.jpg', 'productos/cable_2.5mm_2.jpg', 'productos/cable_2.5mm_3.jpg', 'productos/cable_2.5mm_4.jpg', 2),
('img3', 'productos/interruptor_simple_1.jpg', 'productos/interruptor_simple_2.jpg', 'productos/interruptor_simple_3.jpg', 'productos/interruptor_simple_4.jpg', 3),
('img4', 'productos/tubo_led_18w_1.jpg', 'productos/tubo_led_18w_2.jpg', 'productos/tubo_led_18w_3.jpg', 'productos/tubo_led_18w_4.jpg', 4),
('img5', 'productos/portalampares_e27_1.jpg', 'productos/portalampares_e27_2.jpg', 'productos/portalampares_e27_3.jpg', 'productos/portalampares_e27_4.jpg', 5),
('img6', 'productos/lampara_techo_moderna_1.jpg', 'productos/lampara_techo_moderna_2.jpg', 'productos/lampara_techo_moderna_3.jpg', 'productos/lampara_techo_moderna_4.jpg', 6),
('img7', 'productos/foco_inteligente_rgb_1.jpg', 'productos/foco_inteligente_rgb_2.jpg', 'productos/foco_inteligente_rgb_3.jpg', 'productos/foco_inteligente_rgb_4.jpg', 7),
('img8', 'productos/panel_led_30x30_1.jpg', 'productos/panel_led_30x30_2.jpg', 'productos/panel_led_30x30_3.jpg', 'productos/panel_led_30x30_4.jpg', 8),
('img9', 'productos/lampara_pie_1.jpg', 'productos/lampara_pie_2.jpg', 'productos/lampara_pie_3.jpg', 'productos/lampara_pie_4.jpg', 9),
('img10', 'productos/foco_halogeno_50w_1.jpg', 'productos/foco_halogeno_50w_2.jpg', 'productos/foco_halogeno_50w_3.jpg', 'productos/foco_halogeno_50w_4.jpg', 10),
('img11', 'productos/caja_conexion_10x10_1.jpg', 'productos/caja_conexion_10x10_2.jpg', 'productos/caja_conexion_10x10_3.jpg', 'productos/caja_conexion_10x10_4.jpg', 11),
('img12', 'productos/breaker_20a_1.jpg', 'productos/breaker_20a_2.jpg', 'productos/breaker_20a_3.jpg', 'productos/breaker_20a_4.jpg', 12),
('img13', 'productos/cable_thhn_14awg_1.jpg', 'productos/cable_thhn_14awg_2.jpg', 'productos/cable_thhn_14awg_3.jpg', 'productos/cable_thhn_14awg_4.jpg', 13),
('img14', 'productos/toma_corriente_doble_1.jpg', 'productos/toma_corriente_doble_2.jpg', 'productos/toma_corriente_doble_3.jpg', 'productos/toma_corriente_doble_4.jpg', 14),
('img15', 'productos/cinta_aislante_negra_1.jpg', 'productos/cinta_aislante_negra_2.jpg', 'productos/cinta_aislante_negra_3.jpg', 'productos/cinta_aislante_negra_4.jpg', 15),
('img16', 'productos/lampara_vintage_1.jpg', 'productos/lampara_vintage_2.jpg', 'productos/lampara_vintage_3.jpg', 'productos/lampara_vintage_4.jpg', 16),
('img17', 'productos/foco_ahorrador_15w_1.jpg', 'productos/foco_ahorrador_15w_2.jpg', 'productos/foco_ahorrador_15w_3.jpg', 'productos/foco_ahorrador_15w_4.jpg', 17),
('img18', 'productos/luz_emergencia_led_1.jpg', 'productos/luz_emergencia_led_2.jpg', 'productos/luz_emergencia_led_3.jpg', 'productos/luz_emergencia_led_4.jpg', 18),
('img19', 'productos/reflector_led_50w_1.jpg', 'productos/reflector_led_50w_2.jpg', 'productos/reflector_led_50w_3.jpg', 'productos/reflector_led_50w_4.jpg', 19),
('img20', 'productos/lampara_escritorio_1.jpg', 'productos/lampara_escritorio_2.jpg', 'productos/lampara_escritorio_3.jpg', 'productos/lampara_escritorio_4.jpg', 20),
('img21', 'productos/regleta_6_salidas_1.jpg', 'productos/regleta_6_salidas_2.jpg', 'productos/regleta_6_salidas_3.jpg', 'productos/regleta_6_salidas_4.jpg', 21),
('img22', 'productos/transformador_220v_110v_1.jpg', 'productos/transformador_220v_110v_2.jpg', 'productos/transformador_220v_110v_3.jpg', 'productos/transformador_220v_110v_4.jpg', 22),
('img23', 'productos/sensor_movimiento_1.jpg', 'productos/sensor_movimiento_2.jpg', 'productos/sensor_movimiento_3.jpg', 'productos/sensor_movimiento_4.jpg', 23),
('img24', 'productos/base_foco_gu10_1.jpg', 'productos/base_foco_gu10_2.jpg', 'productos/base_foco_gu10_3.jpg', 'productos/base_foco_gu10_4.jpg', 24),
('img25', 'productos/cable_coaxial_rg6_1.jpg', 'productos/cable_coaxial_rg6_2.jpg', 'productos/cable_coaxial_rg6_3.jpg', 'productos/cable_coaxial_rg6_4.jpg', 25);

-- Insertar características de productos
INSERT INTO CARACTERISTICAS (codigo_caracteristica, nombre_caracteristica, descripcion_caracteristica, PRODUCTOS_codigo_producto) VALUES
(1, 'Potencia', '9W equivalente a 60W incandescente', 1),
(2, 'Vida útil', '25,000 horas', 1),
(3, 'Color', 'Blanco cálido 3000K', 1),
(4, 'Longitud', '100 metros', 2),
(5, 'Calibre', '2.5mm²', 2),
(6, 'Material', 'Cobre electrolítico', 2),
(7, 'Tipo', 'Interruptor simple unipolar', 3),
(8, 'Color', 'Blanco', 3),
(9, 'Material', 'Plástico resistente', 3),
(10, 'Longitud', '1.2 metros', 4),
(11, 'Potencia', '18W equivalente a 36W fluorescente', 4),
(12, 'Base', 'Tipo E27', 5),
(13, 'Material', 'Cerámica', 5),
(14, 'Diseño', 'Moderno con cristal', 6),
(15, 'Tipo de luz', 'LED integrado', 6),
(16, 'Conectividad', 'Wi-Fi y Bluetooth', 7),
(17, 'Colores', '16 millones de colores RGB', 7),
(18, 'Dimensiones', '30x30 cm', 8),
(19, 'Luminosidad', '3600 lúmenes', 8),
(20, 'Altura', '1.5 metros', 9),
(21, 'Amperaje', '20 Amperios', 12),
(22, 'Tensión', '220V', 22),
(23, 'Tipo', 'Sensor infrarrojo', 23),
(24, 'Ángulo', '180 grados', 23),
(25, 'Impedancia', '75 ohmios', 25);


-- Insertar clientes (usando los mismos correos pero como clientes)
INSERT INTO CLIENTE (codigo_cliente, nombre_cliente, correo_cliente, fecha_registro_cliente, telefono_cliente, cumpleanos_cliente, foto_perfil_cliente) VALUES
(1, 'Mayra Valdez', 'mayra.valdez.t@ucb.edu.bo', '2023-01-15', 591714567, '1990-05-20', 'clientes/mayra_valdez.jpg'),
(2, 'Ronald Narvaez', 'ronald.narvaez@ucb.edu.bo', '2023-02-10', 591124568, '1988-07-15', 'clientes/ronald_narvaez.jpg'),
(3, 'Anghelo Pecho', 'anghelo.pecho@ucb.edu.bo', '2023-03-05', 591713569, '1992-11-30', 'clientes/anghelo_pecho.jpg'),
(4, 'Valdir Flores', 'valdir.flores@ucb.edu.bo', '2023-04-20', 591713570, '1985-09-12', 'clientes/valdir_flores.jpg'),
(5, 'Alejandro Mollinedo', 'alejandro.mollinedo@ucb.edu.bo', '2023-05-25', 591723471, '1991-03-08', 'clientes/alejandro_mollinedo.jpg');


-- Insertar pedidos
INSERT INTO PEDIDO (codigo_pedido, fecha_pedido, estado_pedido, total_pedido, CLIENTE_codigo_cliente, VENDEDORE_codigo_vendedore) VALUES
(1, '2024-01-10', 'Completado', 220.00, 1, 2),
(2, '2024-01-15', 'Pendiente', 150.00, 2, 1),
(3, '2024-02-05', 'No Pagado', 95.00, 3, 5),
(4, '2024-02-20', 'Completado', 180.00, 4, 3),
(5, '2024-03-01', 'Completado', 250.00, 5, 4);

-- Insertar detalles de pedidos
INSERT INTO DETALLE_PEDIDO (codigo_detalle_pedido, cantidad_detalle_pedido, precio_unitario_, subtotal_detalle_pedido, PEDIDO_codigo_pedido, PRODUCTOS_codigo_producto, calificacion_pedido) VALUES
(1, 1, 180.00, 180.00, 1, 6, 5),
(2, 2, 20.00, 40.00, 1, 1, 4),
(3, 1, 120.00, 120.00, 2, 2, 5),
(4, 2, 15.00, 30.00, 2, 3, 3),
(5, 1, 95.00, 95.00, 3, 7, 4),
(6, 3, 18.00, 54.00, 4, 11, 4),
(7, 2, 45.00, 90.00, 4, 12, 5),
(8, 1, 150.00, 150.00, 5, 16, 5),
(9, 1, 30.00, 30.00, 5, 17, 4),
(10, 1, 70.00, 70.00, 5, 21, 3);

-- Insertar descuentos de pedidos
INSERT INTO DESCUENTO_PEDIDO (codigo_descuento_pedido, clave_descuento_pedido, fecha_descuento_pedido, monto_descontado, PEDIDO_codigo_pedido, CLIENTE_codigo_cliente) VALUES
(1, 'DESC10', '2024-01-10', 20.00, 1, 1),
(2, 'ELECTRO15', '2024-02-20', 27.00, 4, 4),
(3, 'ILUMINA20', '2024-03-01', 50.00, 5, 5);

-- Insertar pagos
INSERT INTO PAGO (codigo_pago, fecha_pago, monto_pago, estado_pago, VENDEDOR_codigo_vendedore) VALUES
(1, '2024-01-01', 99.99, 'Completado', 1), -- Pago plan estándar Mayra
(2, '2024-01-01', 199.99, 'Completado', 2), -- Pago plan premium Ronald
(3, '2024-01-01', 49.99, 'Completado', 3), -- Pago plan básico Anghelo
(4, '2024-01-01', 49.99, 'Completado', 4), -- Pago plan básico Valdir
(5, '2024-01-01', 99.99, 'Completado', 5), -- Pago plan estándar Alejandro
(6, '2024-02-01', 99.99, 'Completado', 1), -- Pago recurrente
(7, '2024-02-01', 199.99, 'Completado', 2), -- Pago recurrente
(8, '2024-02-01', 49.99, 'Pendiente', 3), -- Pago pendiente
(9, '2024-01-15', 150.00, 'Completado', 2), -- Servicio diseño personalizado
(10, '2024-01-20', 50.00, 'Completado', 5); -- Servicio publicidad




-- Insertar gift cards
INSERT INTO GIFT_CARDS (codigo_gift_Card, clave_gift_card, fecha_expiracion_gift_card, porcentaje_gift_card, estado_gift_card, VENDEDOR_codigo_vendedore) VALUES
(1, 'GC-ELECTRO-2024', '2024-12-31', 10, true, 1),
(2, 'GC-ILUMINA-2024', '2024-12-31', 15, true, 2),
(3, 'GC-PECHO-2024', '2024-12-31', 5, false, 3),
(4, 'GC-FLORES-2024', '2024-12-31', 20, true, 4),
(5, 'GC-MOLLI-2024', '2024-12-31', 10, false, 5);

-- Insertar favoritos
INSERT INTO FAVORITOS (codigo_favorito, fecha_agregado_favorito, CLIENTE_codigo_cliente, PRODUCTOS_codigo_producto, PORTAL_codigo_portal) VALUES
(1, '2024-01-05', 1, 6, 'iluminacion-narvaez'),
(2, '2024-01-12', 2, 2, 'electrovaldez'),
(3, '2024-02-01', 3, 7, 'iluminacion-narvaez'),
(4, '2024-02-15', 4, 16, 'flores-iluminacion'),
(5, '2024-03-01', 5, 21, 'mollielectric');

-- Insertar servicios
INSERT INTO SERVICIO (codigo_servicio, nombre_servicio, costo_servicio, descripcion_servicio) VALUES
('SERV-PUB', 'Publicidad en portal', 50.00, 'Inclusión de publicidad en el portal del vendedor'),
('SERV-MANT', 'Mantenimiento premium', 100.00, 'Mantenimiento mensual del portal con soporte prioritario'),
('SERV-DES', 'Diseño personalizado', 150.00, 'Servicio de diseño personalizado del portal'),
('SERV-ANAL', 'Analítica avanzada', 75.00, 'Acceso a herramientas de analítica avanzada'),
('SERV-INT', 'Integración API', 200.00, 'Integración con sistemas externos via API'),
('SERV-PLAN', 'Plan de suscripción', 0.00, 'Pago recurrente del plan de suscripción');

-- Insertar transacciones
INSERT INTO TRANSACCION (codigo_transaccion, tipo_transaccion, monto, fecha_transaccion, descripcion, VENDEDOR_codigo_vendedore, SERVICIO_codigo_servicio, PEDIDO_codigo_pedido, PORTAL_codigo_portal, PAGO_codigo_pago) VALUES
-- Gastos (planes y servicios)
(1, 'Gasto', 99.99, '2024-01-01', 'Pago plan estándar', 1, 'SERV-PLAN', 1, 'electrovaldez', 1),
(2, 'Gasto', 199.99, '2024-01-01', 'Pago plan premium', 2, 'SERV-PLAN', 2, 'iluminacion-narvaez', 2),
(3, 'Gasto', 49.99, '2024-01-01', 'Pago plan básico', 3, 'SERV-PLAN', 3, 'pecho-electric', 3),
(4, 'Gasto', 49.99, '2024-01-01', 'Pago plan básico', 4, 'SERV-PLAN', 4, 'flores-iluminacion', 4),
(5, 'Gasto', 99.99, '2024-01-01', 'Pago plan estándar', 5, 'SERV-PLAN', 5, 'mollielectric', 5),
(6, 'Gasto', 99.99, '2024-02-01', 'Pago recurrente plan', 1, 'SERV-PLAN', 1, 'electrovaldez', 6),
(7, 'Gasto', 199.99, '2024-02-01', 'Pago recurrente plan', 2, 'SERV-PLAN', 2, 'iluminacion-narvaez', 7),
(8, 'Gasto', 150.00, '2024-01-15', 'Diseño personalizado', 2, 'SERV-DES', 3, 'iluminacion-narvaez', 9),
(9, 'Gasto', 50.00, '2024-01-20', 'Publicidad en portal', 5, 'SERV-PUB', 4, 'mollielectric', 10),

-- Ingresos (de pedidos)
(10, 'Ingreso', 200.00, '2024-01-12', 'Venta de productos', 2, 'SERV-ANAL', 1, 'iluminacion-narvaez', 1),
(11, 'Ingreso', 150.00, '2024-01-16', 'Venta de cables', 1, 'SERV-DES', 2, 'electrovaldez', 2),
(12, 'Ingreso', 126.00, '2024-02-21', 'Venta accesorios', 3, 'SERV-INT', 4, 'pecho-electric', 3),
(13, 'Ingreso', 200.00, '2024-03-03', 'Venta lámparas', 4, 'SERV-MANT', 5, 'flores-iluminacion', 4),
(14, 'Ingreso', 95.00, '2024-03-10', 'Venta foco inteligente', 5, 'SERV-PLAN', 3, 'mollielectric', 5);


-- Insertar histórico de configuración
INSERT INTO HISTORICO_CONFIGURACION (codigo_historial, configuracion_anterior, configuracion_nueva, fecha_cambio, cambiado_por, motivo_cambio, PORTAL_codigo_portal) VALUES
(1, '{"tema": "Clásico", "colorPrincipal": "#2c3e50"}', '{"tema": "Moderno", "colorPrincipal": "#e74c3c"}', '2024-01-15 14:30:00', 1, 1, 'electrovaldez'),
(2, '{"productosPorFila": 3}', '{"productosPorFila": 4}', '2024-02-01 10:15:00', 1, 2, 'electrovaldez'),
(3, '{"tema": "Clásico", "colorPrincipal": "#2c3e50"}', '{"tema": "Oscuro", "colorPrincipal": "#1abc9c"}', '2024-01-20 16:45:00', 2, 1, 'iluminacion-narvaez'),
(4, '{"mostrarBanner": true}', '{"mostrarBanner": false}', '2024-02-10 11:20:00', 2, 3, 'iluminacion-narvaez'),
(5, '{"fuentePrincipal": "Arial"}', '{"fuentePrincipal": "Roboto"}', '2024-01-25 09:30:00', 3, 1, 'pecho-electric');


SELECT setval(pg_get_serial_sequence('productos', 'codigo_producto'),
  (SELECT COALESCE(MAX(codigo_producto), 0) FROM productos) + 1);

SELECT setval(
  pg_get_serial_sequence('caracteristicas', 'codigo_caracteristica'),
  (SELECT COALESCE(MAX(codigo_caracteristica), 0) FROM caracteristicas) + 1
);

SELECT setval(pg_get_serial_sequence('cliente', 'codigo_cliente'),
  (SELECT COALESCE(MAX(codigo_cliente), 0) FROM cliente) + 1);