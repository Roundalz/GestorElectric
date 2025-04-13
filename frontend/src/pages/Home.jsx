import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const [servicios, setServicios] = useState([]);
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    codigo_servicio: '',
    nombre_servicio: '',
    costo_servicio: '',
    descripcion_servicio: ''
  });

  // Obtener servicios
  const fetchServicios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/servicios');
      const data = await response.json();
      setServicios(data);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  // Manejo del cambio en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar el envío del formulario para crear un servicio
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo_servicio: formData.codigo_servicio,  // Se envía el código manualmente
          nombre_servicio: formData.nombre_servicio,
          costo_servicio: parseFloat(formData.costo_servicio),
          descripcion_servicio: formData.descripcion_servicio
        })
      });
      if (response.ok) {
        const nuevoServicio = await response.json();
        setServicios([...servicios, nuevoServicio]);
        setFormData({ codigo_servicio: '', nombre_servicio: '', costo_servicio: '', descripcion_servicio: '' });
      } else {
        console.error("Error al crear servicio");
      }
    } catch (error) {
      console.error("Error en el formulario:", error);
    }
  };

  return (
    
    <div>
      <h1>Bienvenido {user ? user.nombre_cliente : 'Invitado'}</h1>
      {user && (
        <p>Tu ID de cliente es: {user.codigo_cliente}</p>
      )}
      {/* El resto de tu contenido */}
      <h1>Lista de Servicioooos</h1>
      <ul>
        {servicios.map((servicio) => (
          <li key={servicio.codigo_servicio}>
            <strong>{servicio.nombre_servicio}</strong> - ${servicio.costo_servicio} <br />
            {servicio.descripcion_servicio}
          </li>
        ))}
      </ul>

      <h2>Crear Servicio</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="codigo_servicio"
          placeholder="Código del servicio"
          value={formData.codigo_servicio}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nombre_servicio"
          placeholder="Nombre del servicio"
          value={formData.nombre_servicio}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="costo_servicio"
          placeholder="Costo del servicio"
          value={formData.costo_servicio}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="descripcion_servicio"
          placeholder="Descripción"
          value={formData.descripcion_servicio}
          onChange={handleChange}
          required
        />
        <button type="submit">Crear Servicio</button>
      </form>
    </div>
  );
}

export default Home;
