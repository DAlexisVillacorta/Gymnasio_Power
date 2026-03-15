import React, { useState } from 'react'
import { Plus, X, Calendar, Clock, User, Dumbbell } from 'lucide-react'
import styles from './ReservarTurnoCard.module.css'

function ReservarTurnoCard(props) {
  const onReservar = props.onReservar
  const [modalAbierto, setModalAbierto] = useState(false)
  
  const [formData, setFormData] = useState({
    clase: '',
    fecha: '',
    horario: ''
  })

  const clasesDisponibles = [
    { id: 1, name: 'CrossFit', instructor: 'Juan Pérez', duration: '60 min' },
    { id: 2, name: 'Spinning', instructor: 'María González', duration: '45 min' },
    { id: 3, name: 'Yoga', instructor: 'Ana Martínez', duration: '60 min' },
    { id: 4, name: 'Funcional', instructor: 'Carlos Rodríguez', duration: '50 min' },
    { id: 5, name: 'Zumba', instructor: 'Laura Fernández', duration: '55 min' },
    { id: 6, name: 'Boxeo', instructor: 'Diego Sánchez', duration: '60 min' }
  ]

  // Horarios sincronizados con el backend (10:00 a 19:00 inclusive)
  const horariosDisponibles = [
    '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00'
  ]

  function abrirModal() {
    setModalAbierto(true)
  }

  function cerrarModal() {
    setModalAbierto(false)
    setFormData({ clase: '', fecha: '', horario: '' })
  }

  function handleClaseChange(e) {
    setFormData({ ...formData, clase: e.target.value })
  }

function handleFechaChange(e) {
  const valor = e.target.value

  if (!valor || valor.length < 10) {
    setFormData({ ...formData, fecha: valor })
    return
  }

  const fechaSeleccionada = new Date(valor)

  if (isNaN(fechaSeleccionada.getTime())) {
    return
  }

  const dia = fechaSeleccionada.getDay()

  if (dia === 0 || dia === 6) {
    alert('No se pueden reservar turnos los fines de semana.')
    return
  }

  setFormData({ ...formData, fecha: valor })
}


  function handleHorarioChange(horario) {
    setFormData({ ...formData, horario })
  }

  function handleSubmit(e) {
    e.preventDefault()
    
    if (!formData.clase || !formData.fecha || !formData.horario) {
      alert('Por favor completá todos los campos')
      return
    }

    const claseSeleccionada = clasesDisponibles.find(
      (clase) => clase.id === parseInt(formData.clase)
    )

    const nuevoTurno = {
      date: formData.fecha,
      time: formData.horario,
      service: {
        name: claseSeleccionada.name,
        instructor: claseSeleccionada.instructor,
        duration: claseSeleccionada.duration
      }
    }

    if (onReservar) {
      onReservar(nuevoTurno)
    }

    cerrarModal()
  }

  const claseSeleccionada = formData.clase
    ? clasesDisponibles.find((c) => c.id === parseInt(formData.clase))
    : null

  return (
    <>
      <div className={styles.tarjetaReservar} onClick={abrirModal}>
        <div className={styles.iconoGrande}>
          <Plus className={styles.icono} />
        </div>
        <h3 className={styles.titulo}>Reservar Turno</h3>
        <p className={styles.descripcion}>Hacé click para reservar una nueva clase</p>
      </div>

      {modalAbierto && (
        <div className={styles.modalOverlay} onClick={cerrarModal}>
          <div className={styles.modalContenido} onClick={(e) => e.stopPropagation()}>
            <button className={styles.botonCerrar} onClick={cerrarModal}>
              <X className={styles.iconoCerrar} />
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.iconoHeader}>
                <Dumbbell className={styles.iconoHeaderDumbbell} />
              </div>
              <h2 className={styles.tituloModal}>Reservar Turno</h2>
              <p className={styles.subtituloModal}>Completá los datos para tu reserva</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formulario}>
              <div className={styles.formGroup}>
                <label htmlFor="clase" className={styles.label}>
                  <Dumbbell className={styles.iconoLabel} /> Clase
                </label>
                <select
                  id="clase"
                  className={styles.select}
                  value={formData.clase}
                  onChange={handleClaseChange}
                  required
                >
                  <option value="">Seleccioná una clase</option>
                  {clasesDisponibles.map((clase) => (
                    <option key={clase.id} value={clase.id}>
                      {clase.name} - {clase.instructor}
                    </option>
                  ))}
                </select>
              </div>

              {claseSeleccionada && (
                <div className={styles.infoClase}>
                  <div className={styles.infoItem}>
                    <User className={styles.iconoInfo} />
                    <span>Instructor: {claseSeleccionada.instructor}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <Clock className={styles.iconoInfo} />
                    <span>Duración: {claseSeleccionada.duration}</span>
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="fecha" className={styles.label}>
                  <Calendar className={styles.iconoLabel} /> Fecha
                </label>
                <input
                  type="date"
                  id="fecha"
                  className={styles.input}
                  value={formData.fecha}
                  onChange={handleFechaChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Clock className={styles.iconoLabel} /> Horario
                </label>
                <div className={styles.gridHorarios}>
                  {horariosDisponibles.map((horario) => (
                    <button
                      key={horario}
                      type="button"
                      className={
                        formData.horario === horario
                          ? styles.botonHorarioSeleccionado
                          : styles.botonHorario
                      }
                      onClick={() => handleHorarioChange(horario)}
                    >
                      {horario}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className={styles.botonSubmit}>
                Confirmar Reserva
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default ReservarTurnoCard
