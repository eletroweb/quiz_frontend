import React, { useEffect, useState } from 'react'

const slides = [
  { src: '/src/assets/banner1.jpg', title: 'Prepare-se para Concursos Públicos', subtitle: 'Plataforma completa com questões, simulados e cursos focados.' },
  { src: '/src/assets/banner2.jpg', title: 'Simulados Realistas', subtitle: 'Treine em condições próximas às provas oficiais.' },
  { src: '/src/assets/banner3.jpg', title: 'Ranking Nacional', subtitle: 'Compare seu desempenho com candidatos em tempo real.' }
]

export default function BannerCarousel() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [])
  return (
    <section className="banner">
      <div className="banner-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <div className="banner-slide" key={i} style={{ backgroundImage: `url('${s.src}')` }}>
            <div className="overlay">
              <h1>{s.title}</h1>
              <p>{s.subtitle}</p>
              <a className="btn-fill" href="#comece">Começar Agora</a>
            </div>
          </div>
        ))}
      </div>
      <div className="banner-controls">
        <button onClick={() => setIndex((index - 1 + slides.length) % slides.length)}>‹</button>
        <button onClick={() => setIndex((index + 1) % slides.length)}>›</button>
      </div>
    </section>
  )
}
