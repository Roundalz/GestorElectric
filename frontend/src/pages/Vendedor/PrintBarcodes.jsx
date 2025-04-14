import React, { useState, useEffect } from "react";
import Barcode from "react-barcode";

function PrintBarcodes() {
  // Supongamos que tienes un array de productos con su info esencial
  const [allProducts] = useState([
    { codigo: "23578q07", nombre: "PRODUCTO 1", precio: 50 },
    { codigo: "111ab01", nombre: "Valvula reguladora", precio: 120 },
    { codigo: "222ab02", nombre: "Interruptor de potencia", precio: 80 },
    // ... etc. Podrías traerlos de un fetch ...
  ]);

  // Estado para la búsqueda y resultados
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Estado para los productos a imprimir
  // Cada item: { codigo, nombre, precio, cantidad (a imprimir) }
  const [printItems, setPrintItems] = useState([]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts([]);
      return;
    }
    // Filtrado simple (en un proyecto real podrías hacer fetch al orquestador)
    const results = allProducts.filter(
      (p) =>
        p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, allProducts]);

  // Maneja la selección de un producto y la cantidad
  const handleAddToPrint = (product, cantidad) => {
    if (!cantidad || Number(cantidad) <= 0) return;
    const toPrint = {
      codigo: product.codigo,
      nombre: product.nombre,
      precio: product.precio,
      cantidad: Number(cantidad),
    };
    // Agregamos al array de printItems
    setPrintItems((prev) => [...prev, toPrint]);
  };

  const handlePrint = () => {
    // Con esta función (window.print) se imprimirá la vista actual:
    window.print();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Imprimir Códigos</h2>
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por código o nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "300px", padding: "0.5rem", marginBottom: "1rem" }}
      />

      {/* Resultados de la búsqueda */}
      {filteredProducts.length > 0 && (
        <div style={resultsContainerStyle}>
          {filteredProducts.map((prod) => (
            <ProductSearchResult
              key={prod.codigo}
              product={prod}
              onAdd={handleAddToPrint}
            />
          ))}
        </div>
      )}

      {/* Vista de los códigos a imprimir */}
      <div style={{ marginTop: "1rem" }}>
        <h3>Códigos a Imprimir</h3>
        {printItems.length === 0 ? (
          <p style={{ fontStyle: "italic" }}>No hay códigos para imprimir.</p>
        ) : (
          <div style={printContainerStyle}>
            {printItems.map((item, index) => {
              // Generamos repetidamente
              const barcodesArray = [];
              for (let i = 0; i < item.cantidad; i++) {
                barcodesArray.push(
                  <div style={barcodeItemStyle} key={`${item.codigo}-${i}`}>
                    <Barcode
                      value={`${item.codigo}`}
                      format="CODE128"
                      displayValue
                    />
                    <p>
                      {item.nombre} - ${item.precio}
                    </p>
                  </div>
                );
              }
              return barcodesArray;
            })}
          </div>
        )}
      </div>

      {/* Botón Imprimir */}
      {printItems.length > 0 && (
        <button onClick={handlePrint} style={printButtonStyle}>
          Imprimir
        </button>
      )}
    </div>
  );
}

// Componente que muestra el producto en la lista de resultados
// y permite ingresar la cantidad de códigos a imprimir
function ProductSearchResult({ product, onAdd }) {
  const [cantidad, setCantidad] = useState("");

  return (
    <div style={searchResultStyle}>
      <div>
        <strong>{product.codigo}</strong> - {product.nombre} (${product.precio})
      </div>
      <input
        type="number"
        min="1"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        style={{ width: "60px", marginLeft: "0.5rem" }}
      />
      <button
        style={{ marginLeft: "0.5rem" }}
        onClick={() => {
          onAdd(product, cantidad);
          setCantidad("");
        }}
      >
        Agregar
      </button>
    </div>
  );
}

// Estilos
const resultsContainerStyle = {
  marginTop: "1rem",
  backgroundColor: "#f9f9f9",
  border: "1px solid #ccc",
  padding: "0.5rem",
};

const searchResultStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "0.5rem",
};

const printContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  border: "1px solid #ccc",
  padding: "1rem",
  marginTop: "0.5rem",
  // Podés agregar un @media print si quieres estilo especial
};

const barcodeItemStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "1rem",
};

const printButtonStyle = {
  marginTop: "1rem",
  padding: "0.5rem 1rem",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  borderRadius: "4px",
};

export default PrintBarcodes;
