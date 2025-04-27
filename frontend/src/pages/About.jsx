// src/pages/About.jsx
import { Link } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import "./About.css";

export default function About() {
  const { user } = useContext(AuthContext);
  return (
    
    <main className="about-page">

{user ? (
  <>
    <h1>
      Bienvenido,{" "}
      {user.role === 'admin'
        ? user.nombre || user.email
        : user.nombre_cliente || user.nombre_vendedor}
    </h1>
    {user.role === 'cliente' ? (
      <p>ID de cliente: {user.codigo_cliente}</p>
    ) : user.role === 'vendedor' ? (
      <p>ID de vendedor: {user.codigo_vendedore}</p>
    ) : user.role === 'admin' ? (
      <p>ID de admin: {user.uid}</p>
    ) : null}
  </>
) : (
  <h1>Bienvenido, Invitado</h1>
)}
      {/* ───── HERO ─────────────────────────────── */}
      <section className="about-hero fade-in">
        <div className="container about-hero__wrap">
          <h1 className="about-hero__title">Sobre&nbsp;GestorElectric</h1>
          <p className="about-hero__subtitle">
            Construimos soluciones SaaS que impulsan la
            <strong> eficiencia energética</strong> y el
            <strong> comercio sostenible</strong>.
          </p>
        </div>
      </section>

      {/* ───── STORY ────────────────────────────── */}
      <section className="about-story container fade-in">
        <h2>Nuestra historia</h2>
        <p>
          GestorElectric nace en 2024 como un proyecto universitario que buscaba
          modernizar la gestión de redes eléctricas para empresas pequeñas y
          medianas. Lo que empezó como un prototipo creció rápidamente hasta
          convertirse en una plataforma escalable que hoy utilizan distribuidores,
          vendedores y técnicos en toda Latinoamérica.
        </p>
      </section>

      {/* ───── VALUES ───────────────────────────── */}
      <section className="about-values fade-in">
        <div className="container">
          <h2 className="text-center">Nuestros valores</h2>
          <div className="about-values__grid">
            <article className="about-valueCard">
              <h3>Innovación</h3>
              <p>
                Adoptamos tecnologías de vanguardia para entregar información en
                tiempo real y analítica inteligente.
              </p>
            </article>

            <article className="about-valueCard">
              <h3>Sostenibilidad</h3>
              <p>
                Promovemos modelos de negocio verdes y optimizamos el consumo
                energético para un futuro responsable.
              </p>
            </article>

            <article className="about-valueCard">
              <h3>Seguridad</h3>
              <p>
                Protegemos los datos de nuestros usuarios con cifrado, auditorías
                permanentes y prácticas DevSecOps.
              </p>
            </article>

            <article className="about-valueCard">
              <h3>Colaboración</h3>
              <p>
                Creemos en el poder del trabajo en equipo. Nuestra plataforma
                facilita la cooperación entre actores clave del sector eléctrico.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ───── TEAM ─────────────────────────────── */}
      <section className="about-team container fade-in">
        <h2>El equipo</h2>

        <div className="about-team__grid">
          {/* Miembro 1 */}
          <figure className="about-teamCard">
            <img src="/team/ronald.jpg" alt="Ronald Narvaez" />
            <figcaption>
              <h4>Ronald Narvaez</h4>
              <p>Scrum Master • Dev&nbsp;Full-Stack</p>
            </figcaption>
          </figure>

          {/* Miembro 2 */}
          <figure className="about-teamCard">
            <img src="/team/anghelo.jpg" alt="Anghelo Pecho" />
            <figcaption>
              <h4>Anghelo Pecho</h4>
              <p>Arquitecto de Software</p>
            </figcaption>
          </figure>

          {/* Miembro 3 */}
          <figure className="about-teamCard">
            <img src="/team/mayra.jpg" alt="Mayra Valdez" />
            <figcaption>
              <h4>Mayra Valdez</h4>
              <p>QA • UX&nbsp;Research</p>
            </figcaption>
          </figure>

          {/* Miembro 4 */}
          <figure className="about-teamCard">
            <img src="/team/alejandro.jpg" alt="Alejandro Mollinedo" />
            <figcaption>
              <h4>Alejandro Mollinedo</h4>
              <p>Data Engineer • DBA</p>
            </figcaption>
          </figure>

          {/* Miembro 5 */}
          <figure className="about-teamCard">
            <img src="/team/valdir.jpg" alt="Valdir Flores" />
            <figcaption>
              <h4>Valdir Flores</h4>
              <p>Dev Ops • Cloud Infra</p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ───── CTA ──────────────────────────────── */}
      <section className="about-cta fade-in">
        <div className="container text-center">
          <h2>Únete a la revolución eléctrica</h2>
          <p>
            Forma parte de nuestra comunidad de empresas que ya transforman su
            gestión energética con GestorElectric.
          </p>
          <Link to="/register" className="btn btn--secondary">
            Crear mi cuenta
          </Link>
        </div>
      </section>

      {/* ───── FOOTER (igual que Home) ──────────── */}
      <footer className="home-footer">
        <div className="container home-footer__grid">
          <div className="home-footer__brand">
            <h3>GestorElectric</h3>
            <p>
              © {new Date().getFullYear()} DeepSeek • Todos los derechos
              reservados
            </p>
          </div>

          <nav className="home-footer__nav">
            <Link to="/">Inicio</Link>
            <Link to="/about">Sobre Nosotros</Link>
            <Link to="/login">Ingresar</Link>
            <Link to="/register">Registro</Link>
          </nav>

          <div className="home-footer__social">
            <a
              href="https://github.com/Roundalz/GestorElectric"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://trello.com/b/zgsE7MQt"
              target="_blank"
              rel="noreferrer"
            >
              Trello
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}






