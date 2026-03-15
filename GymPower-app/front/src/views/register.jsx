import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, Dumbbell, Calendar, Phone } from 'lucide-react'
import api from '../helpers/api.js'
import styles from './Login.module.css'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthdate: '',
    nDni: '',
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

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.birthdate) {
      newErrors.birthdate = 'La fecha de nacimiento es requerida'
    } else {
      const birthDate = new Date(formData.birthdate)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 16) {
        newErrors.birthdate = 'Debes tener al menos 16 años'
      }
    }

    if (!formData.nDni.trim()) {
      newErrors.nDni = 'El DNI es requerido'
    } else if (formData.nDni.trim().length < 7 || formData.nDni.trim().length > 8) {
      newErrors.nDni = 'DNI inválido (7-8 dígitos)'
    }

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
      formData.name && formData.email && formData.birthdate && 
      formData.nDni && formData.username && formData.password)
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!isValid) {
    alert('Por favor completá todos los campos correctamente')
    return
  }

  try {
    const response = await api.post('/users/register', formData)
    
    if (response.data) {
      alert('¡Registro exitoso! Ahora podés iniciar sesión')
      navigate('/')
    }
  } catch (error) {
    console.error('Error en registro:', error)
    if (error.response?.data?.message) {
      alert('Error: ' + error.response.data.message)
    } else {
      alert('Error al registrar. Por favor intentá nuevamente.')
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

        <h2 className={styles.titulo}>Crear Cuenta</h2>
        <p className={styles.subtitulo}>Comenzá tu transformación hoy</p>

        <form onSubmit={handleSubmit} className={styles.formulario}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              <User className={styles.iconoLabel} />
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              placeholder="Juan Pérez"
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              <Mail className={styles.iconoLabel} />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="birthdate" className={styles.label}>
              <Calendar className={styles.iconoLabel} />
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              className={styles.input}
              value={formData.birthdate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.birthdate && <span className={styles.error}>{errors.birthdate}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nDni" className={styles.label}>
              <Phone className={styles.iconoLabel} />
              DNI
            </label>
            <input
              type="text"
              id="nDni"
              name="nDni"
              className={styles.input}
              value={formData.nDni}
              onChange={handleChange}
              placeholder="12345678"
            />
            {errors.nDni && <span className={styles.error}>{errors.nDni}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              <User className={styles.iconoLabel} />
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={styles.input}
              value={formData.username}
              onChange={handleChange}
              placeholder="usuario123"
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
            Registrarse
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.textoFooter}>
            ¿Ya tenés cuenta?{' '}
            <Link to="/" className={styles.enlaceRegistro}>
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}