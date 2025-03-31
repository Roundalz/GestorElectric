import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Mi App</h2>
      <div style={styles.links}>
        <NavLink to="/" style={styles.link} activeStyle={styles.active}>
          Inicio
        </NavLink>
        <NavLink to="/about" style={styles.link} activeStyle={styles.active}>
          Acerca de
        </NavLink>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#282c34",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    color: "white",
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
  },
  active: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
};

export default NavBar;