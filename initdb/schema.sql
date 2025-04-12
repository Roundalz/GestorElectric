CREATE TABLE CARACTERISTICAS (
    codigo_caracteristica serial  NOT NULL,
    nombre_caracteristica varchar(100)  NOT NULL,
    descripcion_caracteristica varchar(100)  NOT NULL,
    PRODUCTOS_codigo_producto int  NOT NULL,
    CONSTRAINT CARACTERISTICAS_pk PRIMARY KEY (codigo_caracteristica)
);

-- Table: CLIENTE
CREATE TABLE CLIENTE (
    codigo_cliente serial  NOT NULL,
    nombre_cliente varchar(100)  NOT NULL,
    correo_cliente varchar(100)  NOT NULL,
    fecha_registro_cliente date  NOT NULL,
    telefono_cliente int  NOT NULL,
    cumpleanos_cliente date  NOT NULL,
    foto_perfil_cliente varchar(255)  NOT NULL,
    CONSTRAINT CLIENTE_pk PRIMARY KEY (codigo_cliente)
);

-- Table: DESCUENTO_PEDIDO
CREATE TABLE DESCUENTO_PEDIDO (
    codigo_descuento_pedido serial  NOT NULL,
    clave_descuento_pedido varchar(255)  NOT NULL,
    fecha_descuento_pedido date  NOT NULL,
    monto_descontado int  NOT NULL,
    PEDIDO_codigo_pedido int  NOT NULL,
    CLIENTE_codigo_cliente int  NOT NULL,
    CONSTRAINT DESCUENTO_PEDIDO_pk PRIMARY KEY (codigo_descuento_pedido)
);

-- Table: DETALLE_PEDIDO
CREATE TABLE DETALLE_PEDIDO (
    codigo_detalle_pedido serial  NOT NULL,
    cantidad_detalle_pedido int  NOT NULL,
    precio_unitario_ decimal(10,2)  NOT NULL,
    subtotal_detalle_pedido decimal(10,2)  NOT NULL,
    PEDIDO_codigo_pedido int  NOT NULL,
    PRODUCTOS_codigo_producto int  NOT NULL,
    calificacion_pedido int  NOT NULL,
    CONSTRAINT DETALLE_PEDIDO_pk PRIMARY KEY (codigo_detalle_pedido)
);

-- Table: FAVORITOS
CREATE TABLE FAVORITOS (
    codigo_favorito serial  NOT NULL,
    fecha_agregado_favorito date  NOT NULL,
    CLIENTE_codigo_cliente int  NOT NULL,
    PRODUCTOS_codigo_producto int  NOT NULL,
    PORTAL_codigo_portal varchar(100)  NOT NULL,
    CONSTRAINT FAVORITOS_pk PRIMARY KEY (codigo_favorito)
);

-- Table: GIFT_CARDS
CREATE TABLE GIFT_CARDS (
    codigo_gift_Card serial  NOT NULL,
    clave_gift_card varchar(255)  NOT NULL,
    fecha_expiracion_gift_card date  NOT NULL,
    porcentaje_gift_card int  NOT NULL,
    estado_gift_card boolean  NOT NULL,
    VENDEDOR_codigo_vendedore int  NOT NULL,
    CONSTRAINT GIFT_CARDS_pk PRIMARY KEY (codigo_gift_Card)
);

-- Table: HISTORICO_CONFIGURACION
CREATE TABLE HISTORICO_CONFIGURACION (
    codigo_historial serial  NOT NULL,
    configuracion_anterior jsonb  NOT NULL,
    configuracion_nueva jsonb  NOT NULL,
    fecha_cambio timestamp  NOT NULL,
    cambiado_por int  NOT NULL,
    motivo_cambio int  NOT NULL,
    PORTAL_codigo_portal varchar(100)  NOT NULL,
    CONSTRAINT HISTORICO_CONFIGURACION_pk PRIMARY KEY (codigo_historial)
);

-- Table: IMG_PRODUCTO
CREATE TABLE IMG_PRODUCTO (
    codigo_img_producto varchar(100)  NOT NULL,
    primer_angulo varchar(255)  NOT NULL,
    segundo_angulo varchar(255)  NOT NULL,
    tercer_angulo varchar(255)  NOT NULL,
    cuarto_angulo varchar(255)  NOT NULL,
    PRODUCTOS_codigo_producto int  NOT NULL,
    CONSTRAINT IMG_PRODUCTO_pk PRIMARY KEY (codigo_img_producto)
);

-- Table: LOG_EVENTO
CREATE TABLE LOG_EVENTO (
    id_logEvento serial  NOT NULL,
    usuario_id int  NOT NULL,
    fecha_hora timestamp  NOT NULL,
    accion varchar(100)  NOT NULL,
    ip_origen varchar(20)  NULL,
    CONSTRAINT LOG_EVENTO_pk PRIMARY KEY (id_logEvento)
);

-- Table: LOG_USUARIO
CREATE TABLE LOG_USUARIO (
    col_logUsuario serial  NOT NULL,
    usuario_id int  NOT NULL,
    fecha_hora timestamp  NOT NULL,
    ip_origen varchar(20)  NULL,
    CONSTRAINT LOG_USUARIO_pk PRIMARY KEY (col_logUsuario)
);

-- Table: PAGO
CREATE TABLE PAGO (
    codigo_pago serial  NOT NULL,
    fecha_pago date  NOT NULL,
    monto_pago decimal(10,2)  NOT NULL,
    estado_pago varchar(100)  NOT NULL,
    VENDEDOR_codigo_vendedore int  NOT NULL,
    CONSTRAINT PAGO_pk PRIMARY KEY (codigo_pago)
);

-- Table: PEDIDO
CREATE TABLE PEDIDO (
    codigo_pedido serial  NOT NULL,
    fecha_pedido date  NOT NULL,
    estado_pedido varchar(100)  NOT NULL,
    total_pedido decimal(10,2)  NOT NULL,
    CLIENTE_codigo_cliente int  NOT NULL,
    VENDEDORE_codigo_vendedore int  NOT NULL,
    CONSTRAINT PEDIDO_pk PRIMARY KEY (codigo_pedido)
);

-- Table: PLANES_PAGO
CREATE TABLE PLANES_PAGO (
    codigo_plan serial  NOT NULL,
    nombre_plan varchar(100)  NOT NULL,
    descripcion varchar(100)  NOT NULL,
    precio_m_s_a decimal(10,2)  NOT NULL,
    comision_venta decimal(5,2)  NOT NULL,
    max_productos int  NOT NULL,
    fecha_expiracion_plan date  NOT NULL,
    CONSTRAINT PLANES_PAGO_pk PRIMARY KEY (codigo_plan)
);

-- Table: PORTAL
CREATE TABLE PORTAL (
    codigo_portal varchar(100)  NOT NULL,
    publicidad_portal boolean  NOT NULL,
    VENDEDOR_codigo_vendedore int  NOT NULL,
    estado_portal varchar(100)  NOT NULL,
    CONSTRAINT PORTAL_pk PRIMARY KEY (codigo_portal)
);

-- Table: PORTAL_CONFIGURACION
CREATE TABLE PORTAL_CONFIGURACION (
    codigo_portal_configuracion serial  NOT NULL,
    PORTAL_codigo_portal varchar(100)  NOT NULL,
    estilo_titulo varchar(255)  NOT NULL,
    tema_seleccionado varchar(100)  NOT NULL,
    color_principal varchar(255)  NOT NULL,
    color_secundario varchar(255)  NOT NULL,
    color_fondo varchar(7)  NOT NULL,
    fuente_principal varchar(50)  NOT NULL,
    disposicion_productos varchar(20)  NOT NULL,
    productos_por_fila int  NOT NULL,
    mostrar_precios boolean  NOT NULL,
    mostrar_valoraciones boolean  NOT NULL,
    estilo_header varchar(20)  NOT NULL,
    mostrar_busqueda boolean  NOT NULL,
    mostrar_categorias boolean  NOT NULL,
    estilos_productos varchar(255)  NOT NULL,
    mostrar_banner boolean  NOT NULL,
    logo_personalizado varchar(255)  NOT NULL,
    banner_personalizado varchar(255)  NOT NULL,
    fecha_actualizacion timestamp  NOT NULL,
    CONSTRAINT unique_portal_config UNIQUE (PORTAL_codigo_portal) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT PORTAL_CONFIGURACION_pk PRIMARY KEY (codigo_portal_configuracion)
);

-- Table: PRODUCTOS
CREATE TABLE PRODUCTOS (
    codigo_producto serial  NOT NULL,
    nombre_producto varchar(100)  NOT NULL,
    tipo_producto varchar(100)  NOT NULL,
    precio_unidad_producto int  NOT NULL,
    cantidad_disponible_producto int  NOT NULL,
    imagen_referencia_producto varchar(100)  NOT NULL,
    estado_producto varchar(100)  NOT NULL,
    calificacion_producto int  NOT NULL,
    costo_producto int  NOT NULL,
    descuento_producto int  NOT NULL,
    VENDEDOR_codigo_vendedore int  NOT NULL,
    PORTAL_codigo_portal varchar(100)  NOT NULL,
    CONSTRAINT PRODUCTOS_pk PRIMARY KEY (codigo_producto)
);


-- Table: SERVICIO
CREATE TABLE SERVICIO (
    codigo_servicio varchar(100)  NOT NULL,
    nombre_servicio varchar(100)  NOT NULL,
    costo_servicio decimal(10,2)  NOT NULL,
    descripcion_servicio varchar(100)  NOT NULL,
    CONSTRAINT SERVICIO_pk PRIMARY KEY (codigo_servicio)
);

-- Table: TEMAS_PORTAL
CREATE TABLE TEMAS_PORTAL (
    codigo_tema serial  NOT NULL,
    nombre_tema varchar(100)  NOT NULL,
    descripcion_tema varchar(255)  NOT NULL,
    es_predeterminado boolean  NOT NULL,
    datos_config jsonb  NOT NULL,
    fecha_creacion timestamp  NOT NULL,
    creado_por int  NOT NULL,
    CONSTRAINT TEMAS_PORTAL_pk PRIMARY KEY (codigo_tema)
);

-- Table: TRANSACCION
CREATE TABLE TRANSACCION (
    codigo_transaccion serial  NOT NULL,
    tipo_transaccion varchar(100)  NOT NULL,
    monto int  NOT NULL,
    fecha_transaccion date  NOT NULL,
    descripcion varchar(100)  NOT NULL,
    VENDEDOR_codigo_vendedore int  NOT NULL,
    SERVICIO_codigo_servicio varchar(100)  NOT NULL,
    PEDIDO_codigo_pedido int  NOT NULL,
    PORTAL_codigo_portal varchar(100)  NOT NULL,
    PAGO_codigo_pago int  NOT NULL,
    CONSTRAINT TRANSACCION_pk PRIMARY KEY (codigo_transaccion)
);

-- Table: VENDEDOR
CREATE TABLE VENDEDOR (
    codigo_vendedore serial  NOT NULL,
    nombre_vendedor varchar(100)  NOT NULL,
    correo_vendedor varchar(100)  NOT NULL,
    telefono_vendedor varchar(100)  NOT NULL,
    clave_vendedor varchar(255)  NOT NULL,
    estado_vendedor varchar(100)  NOT NULL,
    nombre_empresa varchar(100)  NOT NULL,
    tipo_empresa varchar(100)  NOT NULL,
    logo_empresa varchar(250)  NOT NULL,
    correo_empresa varchar(100)  NOT NULL,
    telefono_empresa varchar(100)  NOT NULL,
    pais_empresa varchar(100)  NOT NULL,
    ciudad_empresa varchar(100)  NOT NULL,
    direccion_empresa varchar(100)  NOT NULL,
    banner_empresa varchar(255)  NOT NULL,
    PLANES_PAGO_codigo_plan int  NOT NULL,
    CONSTRAINT VENDEDOR_pk PRIMARY KEY (codigo_vendedore)
);

-- foreign keys
-- Reference: CARACTERISTICAS_PRODUCTOS (table: CARACTERISTICAS)
ALTER TABLE CARACTERISTICAS ADD CONSTRAINT CARACTERISTICAS_PRODUCTOS
    FOREIGN KEY (PRODUCTOS_codigo_producto)
    REFERENCES PRODUCTOS (codigo_producto)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: DETALLE_PEDIDO_PEDIDO (table: DETALLE_PEDIDO)
ALTER TABLE DETALLE_PEDIDO ADD CONSTRAINT DETALLE_PEDIDO_PEDIDO
    FOREIGN KEY (PEDIDO_codigo_pedido)
    REFERENCES PEDIDO (codigo_pedido)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: DETALLE_PEDIDO_PRODUCTOS (table: DETALLE_PEDIDO)
ALTER TABLE DETALLE_PEDIDO ADD CONSTRAINT DETALLE_PEDIDO_PRODUCTOS
    FOREIGN KEY (PRODUCTOS_codigo_producto)
    REFERENCES PRODUCTOS (codigo_producto)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: FAVORITOS_CLIENTE (table: FAVORITOS)
ALTER TABLE FAVORITOS ADD CONSTRAINT FAVORITOS_CLIENTE
    FOREIGN KEY (CLIENTE_codigo_cliente)
    REFERENCES CLIENTE (codigo_cliente)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: FAVORITOS_PORTAL (table: FAVORITOS)
ALTER TABLE FAVORITOS ADD CONSTRAINT FAVORITOS_PORTAL
    FOREIGN KEY (PORTAL_codigo_portal)
    REFERENCES PORTAL (codigo_portal)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: FAVORITOS_PRODUCTOS (table: FAVORITOS)
ALTER TABLE FAVORITOS ADD CONSTRAINT FAVORITOS_PRODUCTOS
    FOREIGN KEY (PRODUCTOS_codigo_producto)
    REFERENCES PRODUCTOS (codigo_producto)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: HISTORICO_CONFIGURACION_PORTAL (table: HISTORICO_CONFIGURACION)
ALTER TABLE HISTORICO_CONFIGURACION ADD CONSTRAINT HISTORICO_CONFIGURACION_PORTAL
    FOREIGN KEY (PORTAL_codigo_portal)
    REFERENCES PORTAL (codigo_portal)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: HISTORICO_CONFIGURACION_VENDEDOR (table: HISTORICO_CONFIGURACION)
ALTER TABLE HISTORICO_CONFIGURACION ADD CONSTRAINT HISTORICO_CONFIGURACION_VENDEDOR
    FOREIGN KEY (cambiado_por)
    REFERENCES VENDEDOR (codigo_vendedore)
    ON DELETE  RESTRICT 
    ON UPDATE  CASCADE 
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: IMG_PRODUCTO_PRODUCTOS (table: IMG_PRODUCTO)
ALTER TABLE IMG_PRODUCTO ADD CONSTRAINT IMG_PRODUCTO_PRODUCTOS
    FOREIGN KEY (PRODUCTOS_codigo_producto)
    REFERENCES PRODUCTOS (codigo_producto)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PAGO_VENDEDOR (table: PAGO)
ALTER TABLE PAGO ADD CONSTRAINT PAGO_VENDEDOR
    FOREIGN KEY (VENDEDOR_codigo_vendedore)
    REFERENCES VENDEDOR (codigo_vendedore)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PEDIDO_CLIENTE (table: PEDIDO)
ALTER TABLE PEDIDO ADD CONSTRAINT PEDIDO_CLIENTE
    FOREIGN KEY (CLIENTE_codigo_cliente)
    REFERENCES CLIENTE (codigo_cliente)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PEDIDO_VENDEDORE (table: PEDIDO)
ALTER TABLE PEDIDO ADD CONSTRAINT PEDIDO_VENDEDORE
    FOREIGN KEY (VENDEDORE_codigo_vendedore)
    REFERENCES VENDEDOR (codigo_vendedore)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PORTAL_CONFIGURACION_PORTAL (table: PORTAL_CONFIGURACION)
ALTER TABLE PORTAL_CONFIGURACION ADD CONSTRAINT PORTAL_CONFIGURACION_PORTAL
    FOREIGN KEY (PORTAL_codigo_portal)
    REFERENCES PORTAL (codigo_portal)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PORTAL_VENDEDORE (table: PORTAL)
ALTER TABLE PORTAL ADD CONSTRAINT PORTAL_VENDEDORE
    FOREIGN KEY (VENDEDOR_codigo_vendedore)
    REFERENCES VENDEDOR (codigo_vendedore)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PRODUCTOS_PORTAL (table: PRODUCTOS)
ALTER TABLE PRODUCTOS ADD CONSTRAINT PRODUCTOS_PORTAL
    FOREIGN KEY (PORTAL_codigo_portal)
    REFERENCES PORTAL (codigo_portal)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: PRODUCTOS_VENDEDOR (table: PRODUCTOS)
ALTER TABLE PRODUCTOS ADD CONSTRAINT PRODUCTOS_VENDEDOR
    FOREIGN KEY (VENDEDOR_codigo_vendedore)
    REFERENCES VENDEDOR (codigo_vendedore)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: TRANSACCION_PAGO (table: TRANSACCION)
ALTER TABLE TRANSACCION ADD CONSTRAINT TRANSACCION_PAGO
    FOREIGN KEY (PAGO_codigo_pago)
    REFERENCES PAGO (codigo_pago)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: TRANSACCION_PEDIDO (table: TRANSACCION)
ALTER TABLE TRANSACCION ADD CONSTRAINT TRANSACCION_PEDIDO
    FOREIGN KEY (PEDIDO_codigo_pedido)
    REFERENCES PEDIDO (codigo_pedido)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: TRANSACCION_PORTAL (table: TRANSACCION)
ALTER TABLE TRANSACCION ADD CONSTRAINT TRANSACCION_PORTAL
    FOREIGN KEY (PORTAL_codigo_portal)
    REFERENCES PORTAL (codigo_portal)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: TRANSACCION_SERVICIO (table: TRANSACCION)
ALTER TABLE TRANSACCION ADD CONSTRAINT TRANSACCION_SERVICIO
    FOREIGN KEY (SERVICIO_codigo_servicio)
    REFERENCES SERVICIO (codigo_servicio)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: TRANSACCION_VENDEDOR (table: TRANSACCION)
ALTER TABLE TRANSACCION ADD CONSTRAINT TRANSACCION_VENDEDOR
    FOREIGN KEY (VENDEDOR_codigo_vendedore)
    REFERENCES VENDEDOR (codigo_vendedore)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Table_15_CLIENTE (table: DESCUENTO_PEDIDO)
ALTER TABLE DESCUENTO_PEDIDO ADD CONSTRAINT Table_15_CLIENTE
    FOREIGN KEY (CLIENTE_codigo_cliente)
    REFERENCES CLIENTE (codigo_cliente)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Table_15_PEDIDO (table: DESCUENTO_PEDIDO)
ALTER TABLE DESCUENTO_PEDIDO ADD CONSTRAINT Table_15_PEDIDO
    FOREIGN KEY (PEDIDO_codigo_pedido)
    REFERENCES PEDIDO (codigo_pedido)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Table_16_VENDEDOR (table: GIFT_CARDS)
ALTER TABLE GIFT_CARDS ADD CONSTRAINT Table_16_VENDEDOR
    FOREIGN KEY (VENDEDOR_codigo_vendedore)
    REFERENCES VENDEDOR (codigo_vendedore)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: VENDEDOR_PLANES_PAGO (table: VENDEDOR)
ALTER TABLE VENDEDOR ADD CONSTRAINT VENDEDOR_PLANES_PAGO
    FOREIGN KEY (PLANES_PAGO_codigo_plan)
    REFERENCES PLANES_PAGO (codigo_plan)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_temas_portal_vendedor (table: TEMAS_PORTAL)
ALTER TABLE TEMAS_PORTAL ADD CONSTRAINT fk_temas_portal_vendedor
    FOREIGN KEY (creado_por)
    REFERENCES VENDEDOR (codigo_vendedore)
    ON DELETE  RESTRICT 
    ON UPDATE  CASCADE 
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;






