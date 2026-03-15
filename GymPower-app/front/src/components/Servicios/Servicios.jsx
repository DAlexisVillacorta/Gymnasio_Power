import React from 'react'
import { Dumbbell, Users, Calendar, Award } from 'lucide-react'
import styles from './Servicios.module.css'

function Servicios() {
  const servicios = [
    { Icono: Dumbbell, titulo: "Entrenamiento Personalizado", descripcion: "Rutinas diseñadas específicamente para tus objetivos" },
    { Icono: Users, titulo: "Clases Grupales", descripcion: "Entrenamientos dinámicos con instructores certificados" },
    { Icono: Calendar, titulo: "Horarios Flexibles", descripcion: "Abierto todos los días con amplio horario" },
    { Icono: Award, titulo: "Equipamiento Premium", descripcion: "Máquinas de última generación y zona funcional" }
  ]

  return React.createElement('section', { id: 'servicios', className: styles.servicios },
    React.createElement('div', { className: styles.contenedor },
      React.createElement('h2', { className: styles.titulo },
        'Nuestros ',
        React.createElement('span', { className: styles.tituloDestacado }, 'Servicios')
      ),
      React.createElement('p', { className: styles.subtitulo },
        'Todo lo que necesitas para alcanzar tu mejor versión'
      ),
      React.createElement('div', { className: styles.grid },
        servicios.map((servicio, index) =>
          React.createElement('div', { key: index, className: styles.tarjeta },
            React.createElement('div', { className: styles.iconoContainer },
              React.createElement(servicio.Icono, { className: styles.icono })
            ),
            React.createElement('h3', { className: styles.tituloTarjeta }, servicio.titulo),
            React.createElement('p', { className: styles.descripcionTarjeta }, servicio.descripcion)
          )
        )
      )
    )
  )
}

export default Servicios