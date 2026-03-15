import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight } from 'lucide-react'
import styles from './Hero.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const sliderRef = useRef(null)
  const cardsRef = useRef([])
  const tituloRef = useRef(null)
  const descripcionRef = useRef(null)

  const tarjetas = [
    { img: '/img/entrenamiento1.jpg', titulo: 'Empieza en el Mejor Lugar', desc: 'Desarrollá tu máximo potencial' },
    { img: '/img/Funcional.jpg', titulo: 'Crossfit', desc: 'Mejorá tu resistencia' },
    { img: '/img/entrenamiento3.jpg', titulo: 'Zona Funcional', desc: 'Entrenamiento completo' },
    { img: '/img/entrenamiento2.jpg', titulo: 'Clases Grupales', desc: 'Motivación en equipo' },
    { img: '/img/Fuerza.jpg', titulo: 'Pesas Libres', desc: 'Construcción muscular' },
    { img: '/img/Trainning.jpg', titulo: 'Full Body Training', desc: 'Trabajo integral' }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del título
      gsap.from(tituloRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })

      // Animación de la descripción
      gsap.from(descripcionRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
      })

      // Configuración del scroll horizontal
      const totalWidth = sliderRef.current.scrollWidth - sectionRef.current.offsetWidth

      gsap.to(sliderRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${totalWidth * 1.5}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      })

      // Animación de las tarjetas
      cardsRef.current.forEach((card, i) => {
        gsap.from(card, {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sliderRef.current,
            start: 'top 80%'
          }
        })

        // Efecto parallax en hover
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            y: -10,
            duration: 0.3,
            ease: 'power2.out'
          })
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          })
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="inicio" className={styles.hero}>
      <div className={styles.textoIntro}>
        <h1 ref={tituloRef} className={styles.titulo}>
          Transforma tu{' '}
          <span className={styles.tituloGradiente}>Cuerpo y Mente</span>
        </h1>
        <p ref={descripcionRef} className={styles.descripcion}>
          Entrena con los mejores profesionales y accedé a equipamiento premium.
        </p>
      </div>

      <div ref={sliderRef} className={styles.slider}>
        {tarjetas.map((card, i) => (
          <div
            key={i}
            ref={el => (cardsRef.current[i] = el)}
            className={styles.card}
            onClick={() => navigate('/turnos')}
          >
            <div className={styles.imagenContainer}>
              <img src={card.img} alt={card.titulo} className={styles.imagen} />
            </div>
            <div className={styles.overlay}>
              <h3 className={styles.cardTitulo}>{card.titulo}</h3>
              <p className={styles.cardDesc}>{card.desc}</p>
              <div className={styles.cardButton}>
                <span>Reservar</span>
                <ChevronRight className={styles.iconoFlecha} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}