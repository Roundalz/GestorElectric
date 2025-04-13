// frontend/src/pages/Cliente/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function Register() {
  const [role, setRole] = useState('cliente');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // Campos para cliente:
    nombre_cliente: '',
    telefono_cliente: '',
    cumpleanos_cliente: '',
    foto_perfil_cliente: '',
    // Campos para vendedor:
    nombre_vendedor: '',
    telefono_vendedor: '',
    nombre_empresa: '',
    tipo_empresa: '',
    logo_empresa: '',
    correo_empresa: '',
    telefono_empresa: '',
    pais_empresa: '',
    ciudad_empresa: '',
    direccion_empresa: '',
    banner_empresa: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Crear cuenta en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("Usuario creado en Firebase:", userCredential.user);

      // Determinar endpoint según rol
      let endpoint = '/api/auth/register/cliente';
      let bodyData = {
        email: formData.email,
        nombre_cliente: formData.nombre_cliente,
        telefono_cliente: formData.telefono_cliente,
        cumpleanos_cliente: formData.cumpleanos_cliente,
        foto_perfil_cliente: formData.foto_perfil_cliente
      };

      if (role === 'vendedor') {
        endpoint = '/api/auth/register/vendedor';
        bodyData = {
          email: formData.email,
          nombre_vendedor: formData.nombre_vendedor,
          telefono_vendedor: formData.telefono_vendedor,
          nombre_empresa: formData.nombre_empresa,
          tipo_empresa: formData.tipo_empresa,
          logo_empresa: formData.logo_empresa,
          correo_empresa: formData.correo_empresa,
          telefono_empresa: formData.telefono_empresa,
          pais_empresa: formData.pais_empresa,
          ciudad_empresa: formData.ciudad_empresa,
          direccion_empresa: formData.direccion_empresa,
          banner_empresa: formData.banner_empresa
        };
      }

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || 'Error en el registro');
        return;
      }

      if (role === 'vendedor') {
        // Si es vendedor, se devuelve la clave generada
        const data = await response.json();
        setMessage(`Registro exitoso. Tu clave de vendedor es: ${data.clave_vendedor}`);
      } else {
        setMessage("Registro exitoso. Por favor, inicia sesión.");
      }
      // Redirigir al login (puedes mostrar el mensaje antes de redirigir)
    } catch (err) {
      console.error("Error en el registro:", err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>REGISTRARME COMO</h2>
      <form onSubmit={handleRegister}>
        <label>
          <input
            type="radio"
            name="role"
            value="cliente"
            checked={role === 'cliente'}
            onChange={() => setRole('cliente')}
          />
          Cliente
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="vendedor"
            checked={role === 'vendedor'}
            onChange={() => setRole('vendedor')}
          />
          Vendedor
        </label>

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />

        {role === 'cliente' ? (
          <>
            <input
              type="text"
              name="nombre_cliente"
              placeholder="Nombre completo"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="telefono_cliente"
              placeholder="Teléfono"
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="cumpleanos_cliente"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="foto_perfil_cliente"
              placeholder="URL de foto de perfil"
              onChange={handleChange}
              required
            />
          </>
        ) : (
          <>
            <input
              type="text"
              name="nombre_vendedor"
              placeholder="Nombre de vendedor"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="telefono_vendedor"
              placeholder="Teléfono del vendedor"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="nombre_empresa"
              placeholder="Nombre de la empresa"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="tipo_empresa"
              placeholder="Tipo de empresa"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="logo_empresa"
              placeholder="URL del logo"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="correo_empresa"
              placeholder="Correo de la empresa"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="telefono_empresa"
              placeholder="Teléfono de la empresa"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="pais_empresa"
              placeholder="País"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="ciudad_empresa"
              placeholder="Ciudad"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="direccion_empresa"
              placeholder="Dirección"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="banner_empresa"
              placeholder="URL del banner"
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit">REGISTRAR</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
}

export default Register;
