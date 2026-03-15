import React, { useState, useRef } from 'react'
import { Camera, User, Save, Mail, Calendar } from 'lucide-react'
import styles from './MiPerfil.module.css'

export default function MiPerfil({ usuario, onUpdate }) {
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    email: usuario?.email || '',
    foto: usuario?.foto || null
  })
  const [preview, setPreview] = useState(usuario?.foto || null)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        setFormData({ ...formData, foto: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(formData)
    alert('Perfil actualizado exitosamente')
  }

  return (
    <div className={styles.miPerfil}>
      <div className={styles.contenedor}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Mi Perfil</h1>
          <p className={styles.subtitulo}>Administrá tu información personal</p>
        </div>

        <div className={styles.perfilCard}>
          <div className={styles.fotoSection}>
            <div className={styles.avatarContainer}>
              {preview ? (
                <img src={preview} alt="Avatar" className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <User className={styles.iconoUser} />
                </div>
              )}
              <button 
                type="button"
                className={styles.botonCamara}
                onClick={() => fileInputRef.current.click()}
              >
                <Camera className={styles.iconoCamara} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.inputFile}
              />
            </div>
            <div className={styles.idUsuario}>
              <span className={styles.idLabel}>ID de Usuario:</span>
              <span className={styles.idValor}>#{usuario?.id || '00000'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.formulario}>
            <div className={styles.formGroup}>
              <label htmlFor="nombre" className={styles.label}>
                <User className={styles.iconoLabel} />
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="nombre"
                className={styles.input}
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ingresá tu nombre"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                <Mail className={styles.iconoLabel} />
                Email
              </label>
              <input
                type="email"
                id="email"
                className={styles.input}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className={styles.infoBox}>
              <Calendar className={styles.iconoInfo} />
              <div>
                <p className={styles.infoLabel}>Miembro desde</p>
                <p className={styles.infoValor}>
                  {usuario?.fechaRegistro || new Date().toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <button type="submit" className={styles.botonGuardar}>
              <Save className={styles.iconoGuardar} />
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}