import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Página de Inicio</h1>
      <Link to="/about">Ir a About</Link>
    </div>
  );
}

export default Home;
