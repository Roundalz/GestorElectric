// frontend/src/pages/Cliente/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Asegúrate de exportar db en firebaseConfig.js
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [role, setRole] = useState('cliente'); // 'cliente', 'vendedor' o 'admin'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    clave_vendedor: '' // se usará solo para vendedor
  });
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Autenticación en Firebase con email y password
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;
      console.log("Firebase auth exitosa:", uid);

      if (role === 'admin') {
        // 2a. Para admin: Consultar Firestore en la colección "admin"
        const docRef = doc(db, "admin", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const adminData = docSnap.data();
          // Guardamos en el contexto (incluye uid y rol, etc.)
          setUser({ uid, ...adminData, role });
          navigate('/'); // Redirige a home
        } else {
          setError("No se encontró registro de admin en Firestore");
        }
      } else if (role === 'cliente') {
        // 2b. Para cliente: Llamar al endpoint del backend de clientes
        const response = await fetch('http://localhost:5000/api/auth/login/cliente', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        if (!response.ok) {
          const errData = await response.json();
          setError(errData.error || 'Error en el login');
          return;
        }
        const data = await response.json();
        setUser({ ...data, role });
        navigate('/');
      } else if (role === 'vendedor') {
        // 2c. Para vendedor: Se requiere que además se envíe la clave de vendedor
        const response = await fetch('http://localhost:5000/api/auth/login/vendedor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, clave_vendedor: formData.clave_vendedor })
        });
        if (!response.ok) {
          const errData = await response.json();
          setError(errData.error || 'Error en el login');
          return;
        }
        const data = await response.json();
        setUser({ ...data, role });
        navigate('/');
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error en el login: " + err.message);
    }
  };

  return (
    <div>
      <h2>INICIO DE SESIÓN</h2>
      <form onSubmit={handleLogin}>
        <div>
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
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={() => setRole('admin')}
            />
            Admin
          </label>
        </div>
        
        <input
          type="email"
          name="email"
          placeholder="Correo"
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

        {role === 'vendedor' && (
          <input
            type="text"
            name="clave_vendedor"
            placeholder="Clave de vendedor"
            value={formData.clave_vendedor}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">Iniciar Sesión</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>¿No tienes cuenta?
        <button onClick={() => navigate('/register')}>Regístrate</button>
      </p>
    </div>
  );
}

export default Login;
