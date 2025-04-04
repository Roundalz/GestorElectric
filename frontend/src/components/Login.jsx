import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const Login = () => {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Usuario autenticado con éxito");
    } catch (error) {
      console.error("Error en autenticación:", error);
    }
  };

  return (
    <button onClick={signInWithGoogle}>
      Iniciar sesión con Google
    </button>
  );
};

export default Login;
