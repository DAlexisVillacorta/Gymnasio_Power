import React from 'react'
import { Dumbbell } from 'lucide-react'
import styles from './Footer.module.css'

function Footer() {
  return React.createElement('footer', { className: styles.footer },
    React.createElement('div', { className: styles.contenedor },
      React.createElement('div', { className: styles.logo },
        React.createElement('div', { className: styles.iconoLogo },
          React.createElement(Dumbbell, { className: styles.dumbbellIcon })
        ),
        React.createElement('span', { className: styles.nombreGym }, 'POWER GYM')
      ),
      React.createElement('p', { className: styles.copyright },
        '© 2024 Power Gym. Todos los derechos reservados.'
      )
    )
  )
}

export default Footer