import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updatePassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./ClientePerfil.css";

/*  ────────────────────────────────────────────────────────── */
/*  Subida a ImgBB – lee la API‑KEY desde Vite (.env.local)   */
/*  ────────────────────────────────────────────────────────── */
const uploadImgToImgbb = async (file) => {
  const key = import.meta.env.VITE_IMGBB_KEY;
  if (!key) throw new Error("Falta VITE_IMGBB_KEY en .env");

  const form = new FormData();
  form.append("image", file);
  form.append("name", file.name.split(".")[0]);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${key}`,
    { method: "POST", body: form }
  );
  const data = await res.json();
  if (!data.success) throw new Error("Upload failed");

  return data.data.url; // URL directa de la imagen
};
/*  ────────────────────────────────────────────────────────── */

const Perfil = () => {
  const { user, setUser } = useContext(AuthContext);

  /* estado de edición & formularios */
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    nombre_cliente: "",
    telefono_cliente: "",
    cumpleanos_cliente: "",
    foto_perfil_cliente: ""
  });

  /* cargar datos iniciales */
  useEffect(() => {
    if (user?.role === "cliente") {
      setFormData({
        nombre_cliente: user.nombre_cliente || "",
        telefono_cliente: user.telefono_cliente || "",
        cumpleanos_cliente: user.cumpleanos_cliente
          ? new Date(user.cumpleanos_cliente).toISOString().substr(0, 10)
          : "",
        foto_perfil_cliente: user.foto_perfil_cliente || ""
      });
    }
  }, [user]);

  if (!user || user.role !== "cliente") {
    return <p>No estás autenticado como cliente.</p>;
  }

  /* cambios en inputs de texto/fecha */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* toggle edición */
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMessage(null);
  };

  /* NUEVO: manejar selección de archivo */
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImgToImgbb(file);
      setFormData((f) => ({ ...f, foto_perfil_cliente: url }));
    } catch (err) {
      console.error(err);
      setMessage("No se pudo subir la imagen.");
    }
  };

  /* guardar cambios a backend */
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/perfil/cliente/${user.codigo_cliente}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );
      if (!response.ok) {
        const errData = await response.json();
        setMessage(`Error: ${errData.error || "No se pudo actualizar el perfil"}`);
        return;
      }
      const updatedUser = await response.json();
      setUser({ ...user, ...updatedUser });
      setMessage("Perfil actualizado con éxito");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setMessage("Error al actualizar perfil");
    }
  };

  /* cambio de contraseña (Firebase) */
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

  /* ────────────────────────────────────────────────────────── JSX  */
  return (
    <div className="perfil-container">
      <h1>Perfil del Cliente</h1>
      {message && <p className="perfil-message">{message}</p>}

      {isEditing ? (
        <form onSubmit={handleSave} className="perfil-form">
          <label>
            Nombre:
            <input
              type="text"
              name="nombre_cliente"
              value={formData.nombre_cliente}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Teléfono:
            <input
              type="text"
              name="telefono_cliente"
              value={formData.telefono_cliente}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Cumpleaños:
            <input
              type="date"
              name="cumpleanos_cliente"
              value={formData.cumpleanos_cliente}
              onChange={handleChange}
              required
            />
          </label>

          <label className="perfil-file-label">
            Foto de perfil:
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="perfil-file-input"
            />
          </label>

          {/* preview mientras edita */}
          {formData.foto_perfil_cliente && (
            <img
              src={formData.foto_perfil_cliente}
              alt="Preview"
              className="perfil-img-preview"
            />
          )}

          <div className="perfil-form-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={handleEditToggle}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="perfil-details">
          <img
            src={user.foto_perfil_cliente}
            alt="Foto de Perfil"
            className="perfil-img"
          />

          <p><strong>ID:</strong> {user.codigo_cliente}</p>
          <p><strong>Nombre:</strong> {user.nombre_cliente}</p>
          <p><strong>Correo:</strong> {user.correo_cliente}</p>
          <p><strong>Teléfono:</strong> {user.telefono_cliente}</p>
          <p>
            <strong>Cumpleaños:</strong>{" "}
            {new Date(user.cumpleanos_cliente).toLocaleDateString()}
          </p>

          <button onClick={handleEditToggle}>Editar Perfil</button>
        </div>
      )}

      {/* sección contraseña */}
      <div className="password-section">
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="change-password-btn"
        >
          Cambiar de Contraseña
        </button>

        {showPasswordForm && (
          <form onSubmit={handlePasswordUpdate} className="password-form">
            <input
              type="password"
              placeholder="Nueva Contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="password-input"
            />
            <button type="submit" className="update-password-btn">
              Actualizar
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Perfil;
