// frontend/src/pages/Cliente/Login.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";
import logo from "../assets/logo.png";


function Login() {
  const [role, setRole] = useState("cliente");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    clave_vendedor: ""
  });
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ------------- helper para tratar la respuesta del backend ------------- */
  const handleBackendResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
      /** Cuenta BLOQUEADA */
      if (response.status === 423) {
        // data.error ya incluye el mensaje y hora de desbloqueo
        setError(data.error);
        return null;
      }

      /** Fallo normal con remaining_attempts */
      if (data.remaining_attempts !== undefined) {
        setError(
          `${data.error}. Te quedan ${data.remaining_attempts} intento(s).`
        );
      } else {
        setError(data.error || "Error en el login");
      }
      return null;
    }
    // ok!
    return data;
  };

  /* ───────────────────────── handleLogin ───────────────────────── */
const handleLogin = async (e) => {
  e.preventDefault();
  setError(null);

  /* util para mostrar mensaje según respuesta /login/attempt */
  const processAttemptResult = (data) => {
    if (data.bloqueado) {
      setError(
        `Cuenta bloqueada hasta las ${new Date(data.unlock_at)
          .toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}.`
      );
      return false;
    }
    if (data.restantes !== undefined) {
      setError(`Credenciales incorrectas. Intentos restantes: ${data.restantes}`);
      return false;
    }
    setError("Error procesando intento de login");
    return false;
  };

  /* envía intento fallido al backend */
  const notifyFail = async () => {
    try {
      const r = await fetch("http://localhost:5000/api/auth/login/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, role })
      });
      const data = await r.json();
      return processAttemptResult(data);
    } catch {
      setError("Sin conexión con el servidor");
      return false;
    }
  };

  try {
    /* 1. Firebase (auth básica email + pass) */
    const cred = await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const uid = cred.user.uid;
    console.log("Firebase auth exitosa:", uid);

    /* 2. Flujo ADMIN ------------------------------------------------------------------ */
    if (role === "admin") {
      const snap = await getDoc(doc(db, "admin", uid));
      if (snap.exists()) {
        setUser({ uid, ...snap.data(), role });
        return navigate("/");
      }
      return setError("No se encontró registro de admin en Firestore");
    }

    /* 3. Flujo CLIENTE ---------------------------------------------------------------- */
    if (role === "cliente") {
      const resp = await fetch("http://localhost:5000/api/auth/login/cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await handleBackendResponse(resp); // tu helper existente
      if (!data) return;               // error o bloqueado
      setUser({ ...data, role });
      return navigate("/");
    }

    /* 4. Flujo VENDEDOR --------------------------------------------------------------- */
    if (role === "vendedor") {
      const resp = await fetch("http://localhost:5000/api/auth/login/vendedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          clave_vendedor: formData.clave_vendedor
        })
      });
      const data = await handleBackendResponse(resp);
      if (!data) return;               // error o bloqueado
      setUser({ ...data, role });
      return navigate("/");
    }
  } catch (fbErr) {
    /* Firebase dijo que la combinación email-password es incorrecta */
    console.warn("firebase auth falló:", fbErr.code);

    // Para admin no llevamos contador; el resto sí.
    if (role !== "admin") {
      await notifyFail();              // muestra mensajes/intentos/bloqueo
    } else {
      setError("Credenciales de administrador incorrectas");
    }
  }
};


  /* --------------------------- UI --------------------------------------- */
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="company-logo">
          <img src={logo} alt="Company Logo" />
        </div>
      </div>

      <div className="auth-right">
        <h2 className="auth-title">INICIO DE SESIÓN</h2>

        <form onSubmit={handleLogin} className="auth-form">
          {/* Selector de rol */}
          <div className="role-options">
            {["cliente", "vendedor", "admin"].map((r) => (
              <label key={r}>
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={role === r}
                  onChange={() => setRole(r)}
                />
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </label>
            ))}
          </div>

          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
          />
          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Contraseña Firebase"
            onChange={handleChange}
            required
          />

          {role === "vendedor" && (
            <input
              className="auth-input"
              type="text"
              name="clave_vendedor"
              placeholder="Clave de vendedor"
              value={formData.clave_vendedor}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" className="auth-button">
            Continuar
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-footer">
          <p className="auth-disclaimer">
            <a href="/terms">Términos de Uso</a> |{" "}
            <a href="/privacy">Política de Privacidad</a>
          </p>
          <p>
            ¿No tienes cuenta?{" "}
            <button
              className="auth-switch-btn"
              onClick={() => navigate("/register")}
            >
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
