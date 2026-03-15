import React, { useState } from 'react'
import { Dumbbell, User, LogOut, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '../../context/UserContext.jsx'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { user, isLogged, logout } = useUser()

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.contenedor}>
          <Link to={isLogged ? "/inicio" : "/"} className={styles.logo}>
            <div className={styles.iconoLogo}>
              <Dumbbell className={styles.dumbbellIcon} />
            </div>
            <span className={styles.nombreGym}>POWER GYM</span>
          </Link>

          <div className={styles.menuDesktop}>
            {isLogged ? (
              <>
                <Link to="/inicio" className={styles.enlace}>Inicio</Link>
                <Link to="/turnos" className={styles.enlace}>Mis Turnos</Link>
                <Link to="/perfil" className={styles.perfilLink}>
                  {user?.foto ? (
                    <img src={user.foto} alt={user.nombre} className={styles.avatarSmall} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      <User className={styles.iconoUser} />
                    </div>
                  )}
                  <span className={styles.nombreUsuario}>{user?.nombre}</span>
                </Link>
                <button onClick={logout} className={styles.botonLogout}>
                  <LogOut className={styles.iconoLogout} />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/" className={styles.botonLogin}>Login</Link>
                <Link to="/register" className={styles.botonRegistro}>Registrarse</Link>
              </>
            )}
          </div>

          <button 
            className={styles.botonMenuMovil}
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {menuAbierto ? <X className={styles.iconoMenu} /> : <Menu className={styles.iconoMenu} />}
          </button>
        </div>
      </nav>
    </header>
  )
}