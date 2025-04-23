// frontend/src/pages/Cliente/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./Auth.css";
import logo from "../assets/logo.png";

/*  ▸  PON TU API‑KEY  de imgbb  EN .env  (REACT_APP_IMGBB_KEY) */
const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY || "YOUR_IMGBB_API_KEY";

/* ─────────────────────────────────────────────────────────── */
const uploadToImgbb = async (file) => {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
    { method: "POST", body: form }
  );
  const data = await res.json();
  if (!data.success) throw new Error("Error subiendo imagen");
  return data.data.url;                    // 🔗 URL final
};
/* ─────────────────────────────────────────────────────────── */

function Register() {
  const [role, setRole] = useState("cliente");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);            // estado loader

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    /* cliente */
    nombre_cliente: "",
    telefono_cliente: "",
    cumpleanos_cliente: "",
    foto_perfil_cliente: "",
    /* vendedor */
    nombre_vendedor: "",
    telefono_vendedor: "",
    nombre_empresa: "",
    tipo_empresa: "",
    logo_empresa: "",
    correo_empresa: "",
    telefono_empresa: "",
    pais_empresa: "",
    ciudad_empresa: "",
    direccion_empresa: "",
    banner_empresa: ""
  });
  const navigate = useNavigate();

  /* ---- genérico para campos de texto ---- */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ---- subida de archivos (cliente o vendedor) ---- */
  const handleFileSelect = async (e, campo) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadToImgbb(file);
      setFormData((prev) => ({ ...prev, [campo]: url }));
    } catch (err) {
      console.error(err);
      setError("No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  /* -------------------------------------------------- */
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      /* 1. Firebase auth */
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      /* 2. Si es vendedor → ir a Planes Pago (guardamos form) */
      if (role === "vendedor") {
        sessionStorage.setItem("vendedorRegistro", JSON.stringify({ formData }));
        navigate("/planes-pago");
        return;
      }

      /* 3. Cliente: enviamos al backend */
      const endpoint = "/api/auth/register/cliente";
      const bodyData = {
        email: formData.email,
        nombre_cliente: formData.nombre_cliente,
        telefono_cliente: formData.telefono_cliente,
        cumpleanos_cliente: formData.cumpleanos_cliente,
        foto_perfil_cliente: formData.foto_perfil_cliente
      };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || "Error en el registro");
        return;
      }

      setMessage("Registro exitoso. ¡Inicia sesión!");
      // navigate("/login");  ← si lo deseas
    } catch (err) {
      console.error("Error en el registro:", err);
      setError(err.message);
    }
  };

  /*  ███████████████████████████████████████████████████████ */

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="company-logo">
          <img src={logo} alt="Company Logo" />
        </div>
      </div>

      <div className="auth-right">
        <h2 className="auth-title">REGISTRARME COMO</h2>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="role-options">
            <label>
              <input
                type="radio"
                name="role"
                value="cliente"
                checked={role === "cliente"}
                onChange={() => setRole("cliente")}
              />
              Cliente
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="vendedor"
                checked={role === "vendedor"}
                onChange={() => setRole("vendedor")}
              />
              Vendedor
            </label>
          </div>

          {/* campos comunes */}
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
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />

          {/* ───────── CLIENTE ───────── */}
          {role === "cliente" && (
            <>
              <input
                className="auth-input"
                type="text"
                name="nombre_cliente"
                placeholder="Nombre completo"
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="text"
                name="telefono_cliente"
                placeholder="Teléfono"
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="date"
                name="cumpleanos_cliente"
                onChange={handleChange}
                required
              />

              {/* Foto de perfil (carga archivo) */}
              <label className="file-label">
                Foto de perfil
                <input
                  type="file"
                  accept="image/*"
                  className="file-input"
                  onChange={(e) => handleFileSelect(e, "foto_perfil_cliente")}
                />
              </label>

              {/* preview */}
              {formData.foto_perfil_cliente && (
                <img
                  src={formData.foto_perfil_cliente}
                  alt="preview"
                  className="img-preview"
                />
              )}
            </>
          )}

          {/* ───────── VENDEDOR ───────── */}
          {role === "vendedor" && (
            <>
              <input
                className="auth-input"
                type="text"
                name="nombre_vendedor"
                placeholder="Nombre de vendedor"
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="text"
                name="telefono_vendedor"
                placeholder="Teléfono del vendedor"
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="text"
                name="nombre_empresa"
                placeholder="Nombre de la empresa"
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="text"
                name="tipo_empresa"
                placeholder="Tipo de empresa"
                onChange={handleChange}
                required
              />

              {/* Logo */}
              <label className="file-label">
                Logo de la empresa
                <input
                  type="file"
                  accept="image/*"
                  className="file-input"
                  onChange={(e) => handleFileSelect(e, "logo_empresa")}
                />
              </label>
              {formData.logo_empresa && (
                <img src={formData.logo_empresa} alt="logo" className="img-preview" />
              )}

              {/* resto de campos */}
              <input
                className="auth-input"
                type="email"
                name="correo_empresa"
                placeholder="Correo de la empresa"
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="text"
                name="telefono_empresa"
                placeholder="Teléfono de la empresa"
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="text"
                name="pais_empresa"
                placeholder="País"
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="text"
                name="ciudad_empresa"
                placeholder="Ciudad"
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="text"
                name="direccion_empresa"
                placeholder="Dirección"
                onChange={handleChange}
                required
              />

              {/* Banner */}
              <label className="file-label">
                Banner de la empresa
                <input
                  type="file"
                  accept="image/*"
                  className="file-input"
                  onChange={(e) => handleFileSelect(e, "banner_empresa")}
                />
              </label>
              {formData.banner_empresa && (
                <img
                  src={formData.banner_empresa}
                  alt="banner"
                  className="img-preview"
                />
              )}
            </>
          )}

          <button type="submit" className="auth-button" disabled={uploading}>
            {uploading ? "Subiendo imagen..." : "REGISTRAR"}
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}

        <div className="auth-footer">
          <p className="auth-disclaimer">
            <a href="/terms">Terms of Use</a> | <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
