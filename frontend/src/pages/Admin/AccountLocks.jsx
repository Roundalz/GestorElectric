import { useEffect, useState } from "react";
import "./AdminAccountLocks.css"; // ahora te paso también CSS moderno

export default function AdminAccountLocks() {
  const [locks, setLocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchLocks();
  }, []);

  const fetchLocks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/account-locks");
      const data = await res.json();
      setLocks(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleUnlock = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/account-locks/unlock/${id}`, {
        method: "PUT"
      });
      const data = await res.json();
      setMessage(data.message || "Desbloqueado");
      fetchLocks(); // refrescar
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-locks-container">
      <h1>Gestión de Cuentas Bloqueadas</h1>

      {message && <p className="admin-locks-message">{message}</p>}

      {loading ? (
        <p>Cargando bloqueos...</p>
      ) : (
        <table className="admin-locks-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha Unlock</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {locks.map((lock) => {
              const unlockDate = new Date(lock.unlock_at);
              const ahora = new Date();
              const puedeDesbloquear = unlockDate <= ahora;

              return (
                <tr key={lock.id_lock}>
                  <td>{lock.email}</td>
                  <td>{lock.role}</td>
                  <td>{unlockDate.toLocaleString()}</td>
                  <td>
                    <button
                      className="admin-locks-btn"
                      onClick={() => handleUnlock(lock.id_lock)}
                      disabled={!puedeDesbloquear}
                    >
                      {puedeDesbloquear ? "Desbloquear" : "Aún bloqueado"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
