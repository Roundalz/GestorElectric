// frontend/src/pages/Cliente/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Asegúrate de exportar db en firebaseConfig.js
import { AuthContext } from '../context/AuthContext';
import "./Auth.css"; // Archivo CSS para estilos
import logo from "../assets/logo.png"; // Importa el logo desde assets


function Login() {
  const [role, setRole] = useState('cliente'); // 'cliente', 'vendedor' o 'admin'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    clave_vendedor: ''
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
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;
      console.log("Firebase auth exitosa:", uid);

      if (role === 'admin') {
        // 2a. Para admin: Consultar Firestore en la colección "admin"
        const docRef = doc(db, "admin", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const adminData = docSnap.data();
          setUser({ uid, ...adminData, role });
          navigate('/');
        } else {
          setError("No se encontró registro de admin en Firestore");
        }
      } else if (role === 'cliente') {
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
    <div className="auth-container">
      <div className="auth-left">
        <div className="company-logo">
          {/* Logo / Imagen */}
          <img src={logo} alt="Company Logo" />
        </div>
      </div>

      <div className="auth-right">
        <h2 className="auth-title">INICIO DE SESION</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="role-options">
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
            className="auth-input"
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            required
          />
          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="PASS"
            onChange={handleChange}
            required
          />

          {role === 'vendedor' && (
            <input
              className="auth-input"
              type="text"
              name="clave_vendedor"
              placeholder="CÓDIGO DE VENDEDOR"
              value={formData.clave_vendedor}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" className="auth-button">Continue</button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-footer">
          <p className="auth-disclaimer">
            <a href="/terms">Terms of Use</a> | <a href="/privacy">Privacy Policy</a>
          </p>
          <p>Don't have an account? <button className="auth-switch-btn" onClick={() => navigate('/register')}>Sign Up</button></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
