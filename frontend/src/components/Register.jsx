import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuario registrado:", result.user);
      // Puedes redirigir a login o dashboard
    } catch (error) {
      alert("Error al registrarse: " + error.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registro</h2>
      <input type="email" placeholder="Correo" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Register;
