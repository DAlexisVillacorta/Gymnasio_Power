import React from 'react'
import styles from './CTA.module.css'

function CTA() {
  return React.createElement('section', { className: styles.cta },
    React.createElement('div', { className: styles.contenedor },
      React.createElement('div', { className: styles.tarjeta },
        React.createElement('h2', { className: styles.titulo }, '¿Listo para el Cambio?'),
        React.createElement('p', { className: styles.descripcion }, 'Primera semana GRATIS para nuevos miembros'),
        React.createElement('button', { className: styles.boton }, 'Empezar Ahora')
      )
    )
  )
}

export default CTA