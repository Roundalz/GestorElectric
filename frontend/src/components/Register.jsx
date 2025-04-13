// frontend/src/pages/Cliente/Register.jsx
import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre_cliente: '',
    telefono_cliente: '',
    cumpleanos_cliente: '',
    foto_perfil_cliente: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Paso 1: Registro en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("Usuario creado en Firebase:", userCredential.user);
      
      // Paso 2: Registro en la base de datos (tabla CLIENTE)
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          nombre_cliente: formData.nombre_cliente,
          telefono_cliente: parseInt(formData.telefono_cliente),
          cumpleanos_cliente: formData.cumpleanos_cliente,
          foto_perfil_cliente: formData.foto_perfil_cliente
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Registro en base de datos exitoso:", data);
        // Redirigir o guardar el estado de sesión según corresponda
      } else {
        console.error("Error en registro de base de datos");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
        <input type="text" name="nombre_cliente" placeholder="Nombre" onChange={handleChange} required />
        <input type="text" name="telefono_cliente" placeholder="Teléfono" onChange={handleChange} required />
        <input type="date" name="cumpleanos_cliente" placeholder="Fecha de cumpleaños" onChange={handleChange} required />
        <input type="text" name="foto_perfil_cliente" placeholder="URL de Foto de Perfil" onChange={handleChange} required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
