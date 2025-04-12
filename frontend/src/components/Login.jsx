import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario autenticado:", result.user);
      // Redirigir o guardar el token aquí si lo necesitas
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar Sesión</h2>
      <input type="email" placeholder="Correo" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Ingresar</button>
    </form>
  );
}

export default Login;
