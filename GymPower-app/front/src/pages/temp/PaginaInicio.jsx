import React from 'react'
import Hero from '../../components/Hero/Hero.jsx'
import Servicios from '../../components/Servicios/Servicios.jsx'
import CTA from '../../components/CTA/CTA.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import styles from './PaginaInicio.module.css'

export default function PaginaInicio() {
  return (
    <div className={styles.paginaInicio}>
      <Hero />
      <Servicios />
      <CTA />
      <Footer />
    </div>
  )
}
