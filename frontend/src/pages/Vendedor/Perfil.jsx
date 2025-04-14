// frontend/src/pages/Vendedor/VendedorPerfil.jsx
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updatePassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./VendedorPerfil.css";

const Perfil = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
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
    if (user && user.role === "vendedor") {
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

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMessage(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/perfil/vendedor/${user.codigo_vendedore}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
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
    <div className="perfil-container">
      <h1>Perfil del Vendedor</h1>
      {message && <p className="perfil-message">{message}</p>}
      
      {isEditing ? (
        <form onSubmit={handleSave} className="perfil-form">
          <label>
            Nombre:
            <input
              type="text"
              name="nombre_vendedor"
              value={formData.nombre_vendedor}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Teléfono:
            <input
              type="text"
              name="telefono_vendedor"
              value={formData.telefono_vendedor}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Nombre de la Empresa:
            <input
              type="text"
              name="nombre_empresa"
              value={formData.nombre_empresa}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Tipo de Empresa:
            <input
              type="text"
              name="tipo_empresa"
              value={formData.tipo_empresa}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            URL del Logo:
            <input
              type="text"
              name="logo_empresa"
              value={formData.logo_empresa}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Correo de la Empresa:
            <input
              type="email"
              name="correo_empresa"
              value={formData.correo_empresa}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Teléfono de la Empresa:
            <input
              type="text"
              name="telefono_empresa"
              value={formData.telefono_empresa}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            País:
            <input
              type="text"
              name="pais_empresa"
              value={formData.pais_empresa}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Ciudad:
            <input
              type="text"
              name="ciudad_empresa"
              value={formData.ciudad_empresa}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Dirección:
            <input
              type="text"
              name="direccion_empresa"
              value={formData.direccion_empresa}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            URL del Banner:
            <input
              type="text"
              name="banner_empresa"
              value={formData.banner_empresa}
              onChange={handleChange}
              required
            />
          </label>
          <div className="perfil-form-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={handleEditToggle}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="perfil-details">
          <p><strong>ID:</strong> {user.codigo_vendedore}</p>
          <p><strong>Nombre:</strong> {user.nombre_vendedor}</p>
          <p><strong>Correo:</strong> {user.correo_vendedor}</p>
          <p><strong>Teléfono:</strong> {user.telefono_vendedor}</p>
          <p><strong>Estado:</strong> {user.estado_vendedor}</p>
          <p><strong>Empresa:</strong> {user.nombre_empresa}</p>
          <p><strong>Tipo de Empresa:</strong> {user.tipo_empresa}</p>
          <p><strong>Correo de Empresa:</strong> {user.correo_empresa}</p>
          <p><strong>Teléfono de Empresa:</strong> {user.telefono_empresa}</p>
          <p><strong>País:</strong> {user.pais_empresa}</p>
          <p><strong>Ciudad:</strong> {user.ciudad_empresa}</p>
          <p><strong>Dirección:</strong> {user.direccion_empresa}</p>
          <p><strong>Banner:</strong> {user.banner_empresa}</p>
          <button onClick={handleEditToggle}>Editar Perfil</button>
        </div>
      )}

      <div className="password-section">
        <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="change-password-btn">
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
            <button type="submit" className="update-password-btn">Actualizar</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Perfil;
