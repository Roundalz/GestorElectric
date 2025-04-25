// Home.jsx
import { Link } from "react-router-dom";
import "./Home.css";
// Home.jsx (encabezado de imports)
import securityImg from "../assets/security-enterprise.jpg";


export default function Home() {
  return (
    <main className="home">

      {/* ───── HERO ───────────────────────────────────────── */}
      <section className="home-hero">
        <div className="container home-hero__wrap">
          <div className="home-hero__text">
            <h1 className="home-hero__title">GestorElectric</h1>
            <p className="home-hero__subtitle">
              La plataforma&nbsp;SaaS que impulsa la gestión de
              <strong> redes eléctricas</strong> y la venta de
              <strong> productos energéticos</strong>.
            </p>

            <Link to="/register" className="btn btn--primary">
              ¡Empieza gratis!
            </Link>
          </div>

          <img
            src="https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=900&q=80"
            alt="Panel de control GestorElectric"
            className="home-hero__img"
          />
        </div>
      </section>

      {/* ───── VISIÓN & MISIÓN ───────────────────────────── */}
      <section className="home-visionMission container">
        <div className="home-visionMission__grid">
          <article>
            <h2>Visión</h2>
            <p>
              Ser la solución líder en Latinoamérica para la digitalización
              inteligente de redes eléctricas y la gestión comercial de
              productos energéticos, potenciando la sostenibilidad y la
              innovación.
            </p>
          </article>

          <article>
            <h2>Misión</h2>
            <p>
              Facilitar a empresas y profesionales del sector eléctrico una
              plataforma escalable, segura y en tiempo real que simplifique sus
              operaciones, genere información accionable y promueva modelos de
              negocio flexibles.
            </p>
          </article>
        </div>
      </section>

      {/* ───── CARACTERÍSTICAS ───────────────────────────── */}
      <section className="home-features">
        <div className="container">
          <h2 className="text-center">¿Qué ofrece GestorElectric?</h2>

          <div className="home-features__grid">
            <article className="home-featureCard">
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
                alt="Analítica en tiempo real"
              />
              <h3>Analítica en tiempo real</h3>
              <p>
                Dashboards interactivos que muestran consumo y costos al
                instante. Toma decisiones basadas en datos, no en intuiciones.
              </p>
            </article>

            <article className="home-featureCard">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
                alt="Marketplace energético"
              />
              <h3>Marketplace energético</h3>
              <p>
                Vende y administra tus productos con catálogos personalizables,
                carrito y múltiples pasarelas de pago.
              </p>
            </article>

            <article className="home-featureCard">
            <img
              src={securityImg}
              alt="Seguridad de nivel empresarial"
            />
            <h3>Seguridad empresarial</h3>
            <p>
              Autenticación Firebase, cifrado de datos y registros de accesos
              para proteger tu información.
            </p>
          </article>


            {/* ── Modelo freemium flexible ───────────────────────── */}
            <article className="home-featureCard">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
                alt="Modelo freemium"
              />
              <h3>Modelo freemium flexible</h3>
              <p>
                Empieza gratis, escala cuando lo necesites. Cambia de plan con
                un clic y paga solo por lo que uses.
              </p>
            </article>

          </div>
        </div>
      </section>

      {/* ───── CTA ───────────────────────────────────────── */}
      <section className="home-cta">
        <div className="container text-center">
          <h2>¿Listo para electrificar tu negocio?</h2>
          <p>
            Regístrate hoy y experimenta cómo GestorElectric puede transformar
            la gestión de tus redes y productos.
          </p>
          <Link to="/register" className="btn btn--secondary">
            Crear mi cuenta
          </Link>
        </div>
      </section>

      {/* ───── FOOTER ───────────────────────────────────── */}
      <footer className="home-footer">
        <div className="container home-footer__grid">
          <div className="home-footer__brand">
            <h3>GestorElectric</h3>
            <p>© {new Date().getFullYear()} DeepSeek • Todos los derechos reservados</p>
          </div>

          <nav className="home-footer__nav">
            <Link to="/">Inicio</Link>
            <Link to="/about">Sobre Nosotros</Link>
            <Link to="/login">Ingresar</Link>
            <Link to="/register">Registro</Link>
          </nav>

          <div className="home-footer__social">
            <a href="https://github.com/Roundalz/GestorElectric" target="_blank">
              GitHub
            </a>
            <a href="https://trello.com/b/zgsE7MQt" target="_blank">
              Trello
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
