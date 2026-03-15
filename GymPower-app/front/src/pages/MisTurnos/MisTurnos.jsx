/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../helpers/api.js'
import TurnoCard from '../../components/TurnoCard/TurnoCard.jsx'
import ReservarTurnoCard from '../../components/ReservarTurnoCard/ReservarTurnoCard.jsx'
import { Calendar, Trash2  } from 'lucide-react'
import { useUser } from '../../context/UserContext.jsx'
import styles from './MisTurnos.module.css'

export default function MisTurnos() {
  const navigate = useNavigate()
  const { user, isLogged, userAppointments, updateAppointments, logout } = useUser()
  const [loading, setLoading] = useState(true)
  const [borrandoHistorial, setBorrandoHistorial] = useState(false)

  useEffect(() => {
    if (!isLogged || !user) {
      navigate('/')
      return
    }
    cargarTurnos()
  }, [isLogged, user])

  const cargarTurnos = async () => {
    try {
      const response = await api.get(`/users/${user.id}`)
    

      if (response.data && response.data.turns) {
        updateAppointments(response.data.turns)
      }
    } catch (error) {
      console.error('Error al cargar turnos:', error)

      if (error.response?.status === 404) {
        alert('Tu sesión expiró. Por favor, registrate nuevamente.')
        logout()
        navigate('/register')
        return
      }

      if (error.code === 'ERR_NETWORK') {
        alert('No se puede conectar al servidor. ¿Está corriendo el backend?')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReservarTurno = async (nuevoTurno) => {
    try {

    const [year, month, day] = nuevoTurno.date.split('-');
    const fecha = new Date(Number(year), Number(month) - 1, Number(day)); // meses: 0-11

    const diaSemana = fecha.getDay();

    if (diaSemana === 0 || diaSemana === 6) {
      alert("No se pueden agendar turnos los fines de semana (sábado o domingo).");
      return;
    }

      const turnoParaEnviar = {
        date: nuevoTurno.date,
        time: nuevoTurno.time,
        userId: user.id,
        service: nuevoTurno.service
      }

      const response = await api.post('/appointments/schedule', turnoParaEnviar)
      if (response.data) {
        alert('¡Turno reservado exitosamente!')
        cargarTurnos()
      }
    } catch (error) {
      console.error('Error al reservar turno:', error)
      
      if (error.response?.data?.error) {
        alert('Error: ' + error.response.data.error)
      } else {
        alert('Error al reservar turno. Intentá nuevamente.')
      }
    }
  }

  const handleCancelarTurno = async (turnoId) => {
    const confirmar = window.confirm('¿Estás seguro que deseas cancelar este turno?')
    
    if (!confirmar) return

    try {
      const response = await api.put(`/appointments/cancel/${turnoId}`)

      if (response.data) {
        alert('Turno cancelado exitosamente')

        const turnosActualizados = userAppointments.map(turno =>
          turno.id === turnoId ? { ...turno, status: 'cancelled' } : turno
        )
        updateAppointments(turnosActualizados)
      }
    } catch (error) {
      console.error('Error al cancelar turno:', error)
      
      if (error.response?.status === 404) {
        alert('Turno no encontrado')
      } else if (error.response?.data?.error) {
        alert('Error: ' + error.response.data.error)
      } else {
        alert('Error al cancelar turno. Intentá nuevamente.')
      }
    }
  };
  
const handleBorrarHistorialCancelados = async () => {
    const turnosCancelados = userAppointments.filter(turno => turno.status === 'cancelled')
    
    if (turnosCancelados.length === 0) {
      alert('No hay turnos cancelados para borrar.')
      return
    }
    try {
      const idsCancelados = turnosCancelados.map(turno => turno.id)

      const promesas = idsCancelados.map(id => 
        api.delete(`/appointments/${id}`)
      )

      await Promise.all(promesas)

      const turnosRestantes = userAppointments.filter(turno => turno.status !== 'cancelled')
      updateAppointments(turnosRestantes)

      alert(`✅ ${idsCancelados.length} turno(s) cancelado(s) eliminado(s) exitosamente.`)
      
    } catch (error) {
      console.error('Error al borrar historial:', error)
      
      if (error.response?.data?.error) {
        alert('Error: ' + error.response.data.error)
      } else {
        alert('Error al borrar el historial. Intentá nuevamente.')
      }
    } finally {
      setBorrandoHistorial(false)
    }
  }


const turnosActivos = userAppointments.filter(turno => turno.status === 'active')
  const turnosCancelados = userAppointments.filter(turno => turno.status === 'cancelled')

  if (loading) {
    return (
      <div className={styles.misTurnos}>
        <div className={styles.contenedor}>
          <p className={styles.loading}>Cargando turnos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.misTurnos}>
      <div className={styles.contenedor}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.iconoHeader}>
              <Calendar className={styles.iconoGrande} />
            </div>
            <h1 className={styles.titulo}>Mis Turnos</h1>
            <p className={styles.subtitulo}>Administrá tus clases reservadas</p>
          </div>
        </div>

        <section className={styles.seccion}>
          <h2 className={styles.tituloSeccion}>
            Turnos Activos <span className={styles.contador}>({turnosActivos.length})</span>
          </h2>
          <div className={styles.grid}>
            <ReservarTurnoCard onReservar={handleReservarTurno} />
            {turnosActivos.length > 0 ? (
              turnosActivos.map(turno => (
                <TurnoCard 
                  key={turno.id} 
                  turno={turno} 
                  onCancelar={handleCancelarTurno}
                />
              ))
            ) : (
              <div className={styles.sinTurnos}>
                <Calendar className={styles.iconoVacio} />
                <p>No tenés turnos activos</p>
                <span>Reservá tu primera clase haciendo click en el botón "+"</span>
              </div>
            )}
          </div>
        </section>

        {turnosCancelados.length > 0 && (
          <section className={styles.seccion}>
            <div className={styles.headerSeccionCancelados}>
              <h2 className={styles.tituloSeccion}>
                Turnos Cancelados <span className={styles.contador}>({turnosCancelados.length})</span>
              </h2>
              <button
                onClick={handleBorrarHistorialCancelados}
                // eslint-disable-next-line no-undef
                disabled={borrandoHistorial}
                className={styles.botonBorrarHistorial}
                title="Borrar todos los turnos cancelados permanentemente"
              >
                <Trash2 className={styles.iconoBoton} />
                {borrandoHistorial ? 'Borrando...' : 'Borrar Historial'}
              </button>
            </div>
            <div className={styles.grid}>
              {turnosCancelados.map(turno => (
                <TurnoCard 
                  key={turno.id} 
                  turno={turno}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}