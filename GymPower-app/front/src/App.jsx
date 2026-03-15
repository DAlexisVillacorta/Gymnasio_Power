import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar.jsx'
import PaginaInicio from './pages/temp/PaginaInicio.jsx'
import MisTurnos from './pages/MisTurnos/MisTurnos.jsx'
import MiPerfil from './pages/MiPerfil/MiPerfil.jsx'
import Register from './views/register.jsx'
import Login from './views/login.jsx'
import { useUser } from './context/UserContext.jsx'
import styles from './App.module.css'

export default function App() {
  const { isLogged, user, logout, updateUser } = useUser()

  return (
    <main className={styles.main}>
      {isLogged && <Navbar usuario={user} onLogout={logout} />}
      
      <Routes>
        <Route 
          path="/" 
          element={isLogged ? <Navigate to="/inicio" replace /> : <Login />} 
        />
        
        <Route 
          path="/register" 
          element={isLogged ? <Navigate to="/inicio" replace /> : <Register />} 
        />
        
        <Route
          path="/inicio"
          element={isLogged ? <PaginaInicio /> : <Navigate to="/" replace />}
        />
        
        <Route
          path="/turnos"
          element={isLogged ? <MisTurnos /> : <Navigate to="/" replace />}
        />
        
        <Route
          path="/perfil"
          element={isLogged ? <MiPerfil usuario={user} onUpdate={updateUser} /> : <Navigate to="/" replace />}
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}