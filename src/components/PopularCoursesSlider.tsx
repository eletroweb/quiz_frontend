import React, { useRef } from 'react'

const courses = [
  { img: '/src/assets/curso1.jpg', title: 'TJ-SP • Técnico Judiciário', rating: 4.8, reviews: 523 },
  { img: '/src/assets/curso2.jpg', title: 'PF • Policial Rodoviário Federal', rating: 4.7, reviews: 412 },
  { img: '/src/assets/curso3.jpg', title: 'Banco do Brasil • Escriturário', rating: 4.6, reviews: 450 },
  { img: '/src/assets/curso4.jpg', title: 'INSS • Técnico', rating: 4.5, reviews: 389 },
  { img: '/src/assets/curso5.jpg', title: 'TRT • Analista', rating: 4.9, reviews: 275 },
]

export default function PopularCoursesSlider() {
  const ref = useRef<HTMLDivElement>(null)
  const scrollBy = (dx: number) => { ref.current?.scrollBy({ left: dx, behavior: 'smooth' }) }
  return (
    <div className="slider">
      <button className="nav left" onClick={() => scrollBy(-300)}>‹</button>
      <div className="track" ref={ref}>
        {courses.map((c, i) => (
          <div className="course" key={i}>
            <div className="thumb" style={{ backgroundImage: `url('${c.img}')` }} />
            <div className="info">
              <div className="title">{c.title}</div>
              <div className="meta">★ {c.rating} ({c.reviews} avaliações)</div>
              <a className="btn-outline" href="#ver">Ver Curso</a>
            </div>
          </div>
        ))}
      </div>
      <button className="nav right" onClick={() => scrollBy(+300)}>›</button>
    </div>
  )
}
