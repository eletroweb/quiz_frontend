import React from 'react'
import BannerCarousel from './components/BannerCarousel'
import FeatureCards from './components/FeatureCards'
import PopularCoursesSlider from './components/PopularCoursesSlider'

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="container">
          <div className="brand">Quiz Concursos</div>
          <nav>
            <a href="#inicio">Início</a>
            <a href="#concursos">Concursos</a>
            <a href="#cursos">Cursos</a>
            <a href="#planos">Planos</a>
            <a className="btn-outline" href="#login">Login</a>
            <a className="btn-fill" href="#cadastro">Cadastre-se</a>
          </nav>
        </div>
      </header>

      <main>
        <BannerCarousel />
        <section className="container">
          <FeatureCards />
        </section>
        <section className="container">
          <h2>Cursos Populares</h2>
          <PopularCoursesSlider />
        </section>
        <section className="stats">
          <div className="container stats-grid">
            <div className="stat"><div className="value">150.000+</div><div className="label">Alunos Ativos</div></div>
            <div className="stat"><div className="value">10.000.000+</div><div className="label">Questões Resolvidas</div></div>
            <div className="stat"><div className="value">95%</div><div className="label">Taxa de Aprovação</div></div>
            <div className="stat"><div className="value">500+</div><div className="label">Parceiros e Professores</div></div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">© {new Date().getFullYear()} Quiz Concursos</div>
      </footer>
    </div>
  )
}
