import React from 'react'
import { Calendar, Clock, User, Dumbbell, X, CheckCircle } from 'lucide-react'
import styles from './TurnoCard.module.css'

function TurnoCard(props) {
  const turno = props.turno
  const onCancelar = props.onCancelar

function formatearFecha(fecha) {
  if (!fecha) return 'Fecha no disponible'

  if (fecha instanceof Date) {
    if (isNaN(fecha)) return 'Fecha no disponible'
    return fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const fechaObj = new Date(fecha)
  if (!isNaN(fechaObj)) {
    return fechaObj.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const fechaISO = new Date(fecha + 'T00:00:00')
  if (!isNaN(fechaISO)) {
    return fechaISO.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return 'Fecha no disponible'
}


  function handleCancelar() {
    if (onCancelar) {
      onCancelar(turno.id)
    }
  }

  const esCancelado = turno.status === 'cancelled'

  const serviceName = turno.service?.name || 'Clase General'
  const serviceInstructor = turno.service?.instructor || 'Instructor'
  const serviceDuration = turno.service?.duration || '60 min'

  return React.createElement('div', { 
    className: esCancelado ? styles.tarjetaCancelada : styles.tarjeta 
  },
    React.createElement('div', { className: styles.header },
      React.createElement('div', { className: styles.iconoContainer },
        React.createElement(Dumbbell, { className: styles.icono })
      ),
      React.createElement('div', { className: styles.statusBadge },
        esCancelado 
          ? React.createElement('span', { className: styles.badgeCancelado }, 'Cancelado')
          : React.createElement('span', { className: styles.badgeActivo }, 'Activo')
      )
    ),
    React.createElement('h3', { className: styles.titulo }, serviceName),
    React.createElement('div', { className: styles.detalles },
      React.createElement('div', { className: styles.detalle },
        React.createElement(Calendar, { className: styles.iconoDetalle }),
        React.createElement('span', null, formatearFecha(turno.date))
      ),
      React.createElement('div', { className: styles.detalle },
        React.createElement(Clock, { className: styles.iconoDetalle }),
        React.createElement('span', null, turno.time + ' hs')
      ),
      React.createElement('div', { className: styles.detalle },
        React.createElement(User, { className: styles.iconoDetalle }),
        React.createElement('span', null, serviceInstructor)
      ),
      React.createElement('div', { className: styles.detalle },
        React.createElement(CheckCircle, { className: styles.iconoDetalle }),
        React.createElement('span', null, serviceDuration)
      )
    ),
    !esCancelado && React.createElement('button', { 
      className: styles.botonCancelar,
      onClick: handleCancelar
    },
      React.createElement(X, { className: styles.iconoBoton }),
      'Cancelar Turno'
    )
  )
}

export default TurnoCard