import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Dumbbell } from 'lucide-react'
import api from '../helpers/api.js'
import { useUser } from '../context/UserContext.jsx'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useUser()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    validateForm()
  }, [formData])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido'
    } else if (formData.username.trim().length < 4) {
      newErrors.username = 'Mínimo 4 caracteres'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres'
    }

    setErrors(newErrors)
    setIsValid(Object.keys(newErrors).length === 0 && 
      formData.username && formData.password)
  }

  const handleSubmit = async (e) => {
    e
    .preventDefault()
    if (!isValid) {
      alert('Por favor completá todos los campos correctamente')
      return
    }

    try {
      const response = await api.post('/users/login', formData)
      
      if (response.data && response.data.user) {
        const userData = {
          id: response.data.user.id,
          nombre: response.data.user.name,
          email: response.data.user.email,
          username: response.data.user.username,
          foto: null,
          fechaRegistro: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }

        login(userData, response.data.token)
        
        alert('¡Login exitoso! Bienvenido ' + userData.nombre)
        navigate('/inicio')
      }
    } catch (error) {
      console.error('Error en login:', error)
      if (error.response?.data?.message) {
        alert('Error: ' + error.response.data.message)
      } else {
        alert('Error al iniciar sesión. Verificá tus credenciales.')
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div className={styles.login}>
      <div className={styles.contenedor}>
        <div className={styles.logoHeader}>
          <div className={styles.iconoLogo}>
            <Dumbbell className={styles.iconoDumbbell} />
          </div>
          <h1 className={styles.nombreGym}>POWER GYM</h1>
        </div>

        <h2 className={styles.titulo}>Iniciar Sesión</h2>
        <p className={styles.subtitulo}>Bienvenido de vuelta</p>

        <form onSubmit={handleSubmit} className={styles.formulario}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              <Mail className={styles.iconoLabel} />
              Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={styles.input}
              value={formData.username}
              onChange={handleChange}
              placeholder="tu_usuario"
            />
            {errors.username && <span className={styles.error}>{errors.username}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              <Lock className={styles.iconoLabel} />
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className={styles.botonSubmit}
            disabled={!isValid}
            style={{ opacity: isValid ? 1 : 0.5, cursor: isValid ? 'pointer' : 'not-allowed' }}
          >
            Entrar
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.textoFooter}>
            ¿No tenés cuenta?{' '}
            <Link to="/register" className={styles.enlaceRegistro}>
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}