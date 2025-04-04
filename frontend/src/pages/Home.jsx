import { useEffect, useState } from 'react';

function Home() {
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/test-db')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTimestamp(data.timestamp);
        } else {
          console.error(data.error);
        }
      });
  }, []);

  return (
    <div>
      <h1>Prueba de conexión con la base de datos</h1>
      {timestamp ? (
        <p>La base de datos respondió: {timestamp}</p>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default Home;
