import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updatePassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./VendedorPerfil.css";

/* ───────────────────────────────────────────────────────────── */
const uploadImgToImgbb = async (file) => {
  const key = import.meta.env.VITE_IMGBB_KEY;
  if (!key) throw new Error("Falta VITE_IMGBB_KEY en .env");
  const form = new FormData();
  form.append("image", file);
  form.append("name", file.name.split(".")[0]);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: form });
  const data = await res.json();
  if (!data.success) throw new Error("Upload failed");
  return data.data.url;
};
/* ───────────────────────────────────────────────────────────── */

const Perfil = () => {
  const { user, setUser } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (user?.role === "vendedor") {
      setFormData({
        nombre_vendedor: user.nombre_vendedor || "",
        telefono_vendedor: user.telefono_vendedor || "",
        nombre_empresa: user.nombre_empresa || "",
        tipo_empresa: user.tipo_empresa || "",
        logo_empresa: user.logo_empresa || "",
        correo_empresa: user.correo_empresa || "",
        telefono_empresa: user.telefono_empresa || "",
        pais_empresa: user.pais_empresa || "",
        ciudad_empresa: user.ciudad_empresa || "",
        direccion_empresa: user.direccion_empresa || "",
        banner_empresa: user.banner_empresa || ""
      });
    }
  }, [user]);

  if (!user || user.role !== "vendedor") {
    return <p>No estás autenticado como vendedor.</p>;
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMessage(null);
  };

  const handleFile = async (e, campo) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImgToImgbb(file);
      setFormData((prev) => ({ ...prev, [campo]: url }));
    } catch (err) {
      console.error(err);
      setMessage("No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/perfil/vendedor/${user.codigo_vendedore}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const err = await res.json();
        setMessage(`Error: ${err.error || "No se pudo actualizar el perfil"}`);
        return;
      }
      const updatedUser = await res.json();
      setUser({ ...user, ...updatedUser });
      setMessage("Perfil actualizado con éxito");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setMessage("Error al actualizar perfil");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(auth.currentUser, newPassword);
      setMessage("Contraseña actualizada con éxito");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      setMessage("Error al cambiar la contraseña: " + error.message);
    }
  };

  return (
    <div className="vendedorPerfil-container">
      <h1 className="vendedorPerfil-title">Perfil del Vendedor</h1>
      {message && <p className="vendedorPerfil-message">{message}</p>}

      {isEditing ? (
        <form onSubmit={handleSave} className="vendedorPerfil-form">
          {/* Datos personales */}
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre_vendedor"
            value={formData.nombre_vendedor}
            onChange={handleChange}
            required
          />

          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono_vendedor"
            value={formData.telefono_vendedor}
            onChange={handleChange}
            required
          />

          {/* Datos empresa */}
          <label>Nombre de Empresa:</label>
          <input
            type="text"
            name="nombre_empresa"
            value={formData.nombre_empresa}
            onChange={handleChange}
            required
          />

          <label>Tipo de Empresa:</label>
          <input
            type="text"
            name="tipo_empresa"
            value={formData.tipo_empresa}
            onChange={handleChange}
            required
          />

          {/* Logo empresa */}
          <label className="vendedorPerfil-file-label">
            Logo de la Empresa:
            <input
              type="file"
              accept="image/*"
              className="vendedorPerfil-file-input"
              onChange={(e) => handleFile(e, "logo_empresa")}
            />
          </label>
          {formData.logo_empresa && (
            <img src={formData.logo_empresa} alt="Logo preview" className="vendedorPerfil-img" />
          )}

          {/* Información extra empresa */}
          <label>Correo Empresa:</label>
          <input
            type="email"
            name="correo_empresa"
            value={formData.correo_empresa}
            onChange={handleChange}
            required
          />

          <label>Teléfono Empresa:</label>
          <input
            type="text"
            name="telefono_empresa"
            value={formData.telefono_empresa}
            onChange={handleChange}
            required
          />

          <label>País:</label>
          <input
            type="text"
            name="pais_empresa"
            value={formData.pais_empresa}
            onChange={handleChange}
            required
          />

          <label>Ciudad:</label>
          <input
            type="text"
            name="ciudad_empresa"
            value={formData.ciudad_empresa}
            onChange={handleChange}
            required
          />

          <label>Dirección:</label>
          <input
            type="text"
            name="direccion_empresa"
            value={formData.direccion_empresa}
            onChange={handleChange}
            required
          />

          {/* Banner empresa */}
          <label className="vendedorPerfil-file-label">
            Banner de Empresa:
            <input
              type="file"
              accept="image/*"
              className="vendedorPerfil-file-input"
              onChange={(e) => handleFile(e, "banner_empresa")}
            />
          </label>
          {formData.banner_empresa && (
            <img src={formData.banner_empresa} alt="Banner preview" className="vendedorPerfil-banner" />
          )}

          <div className="vendedorPerfil-form-buttons">
            <button type="submit" className="vendedorPerfil-save-btn" disabled={uploading}>
              {uploading ? "Subiendo..." : "Guardar"}
            </button>
            <button type="button" onClick={handleEditToggle} className="vendedorPerfil-cancel-btn">
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="vendedorPerfil-details">
          {user.banner_empresa && (
            <img src={user.banner_empresa} alt="Banner" className="vendedorPerfil-banner" />
          )}
          {user.logo_empresa && (
            <img src={user.logo_empresa} alt="Logo" className="vendedorPerfil-logo" />
          )}
          <p><strong>ID:</strong> {user.codigo_vendedore}</p>
          <p><strong>Nombre:</strong> {user.nombre_vendedor}</p>
          <p><strong>Correo:</strong> {user.correo_vendedor}</p>
          <p><strong>Teléfono:</strong> {user.telefono_vendedor}</p>
          <p><strong>Empresa:</strong> {user.nombre_empresa}</p>
          <p><strong>Tipo Empresa:</strong> {user.tipo_empresa}</p>
          <p><strong>Correo Empresa:</strong> {user.correo_empresa}</p>
          <p><strong>Teléfono Empresa:</strong> {user.telefono_empresa}</p>
          <p><strong>País:</strong> {user.pais_empresa}</p>
          <p><strong>Ciudad:</strong> {user.ciudad_empresa}</p>
          <p><strong>Dirección:</strong> {user.direccion_empresa}</p>

          <button onClick={handleEditToggle} className="vendedorPerfil-edit-btn">
            Editar Perfil
          </button>
        </div>
      )}

      {/* Sección contraseña */}
      <div className="vendedorPerfil-password-section">
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="vendedorPerfil-password-toggle"
        >
          Cambiar Contraseña
        </button>

        {showPasswordForm && (
          <form onSubmit={handlePasswordUpdate} className="vendedorPerfil-password-form">
            <input
              type="password"
              placeholder="Nueva Contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="vendedorPerfil-password-input"
            />
            <button type="submit" className="vendedorPerfil-password-btn">
              Actualizar
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Perfil;
