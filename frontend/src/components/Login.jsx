// frontend/src/pages/Cliente/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';


function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Autenticar en Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("Autenticación Firebase exitosa:", userCredential.user);

      // Recuperar datos del cliente desde la base de datos a través del orquestador
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      if (response.ok) {
        const data = await response.json();
        // Guardar usuario en estado global
        setUser(data);
        // Redirigir a Home
        navigate('/');
      } else {
        setError("Cliente no encontrado en la base de datos");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      setError("Error en el login: " + error.message);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
        <button type="submit">Iniciar Sesión</button>
      </form>

      { error && <p style={{color: 'red'}}>{error}</p> }

      <p>¿No tienes cuenta? 
        <button onClick={() => navigate('/register')}>Registrarse</button>
      </p>
    </div>
  );
}

export default Login;
