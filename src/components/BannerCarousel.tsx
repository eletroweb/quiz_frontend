import React, { useEffect, useState } from "react";

const slides = [
  {
    src: "/src/assets/banner1.jpg",
    title: "Prepare-se para Concursos Públicos",
    subtitle: "Plataforma completa com questões, simulados e cursos focados.",
  },
  {
    src: "/src/assets/banner2.jpg",
    title: "Simulados Realistas",
    subtitle: "Treine em condições próximas às provas oficiais.",
  },
  {
    src: "/src/assets/banner3.jpg",
    title: "Ranking Nacional",
    subtitle: "Compare seu desempenho com candidatos em tempo real.",
  },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5000
    );
    return () => clearInterval(id);
  }, []);

  const handlePrev = () =>
    setIndex((index - 1 + slides.length) % slides.length);
  const handleNext = () => setIndex((index + 1) % slides.length);

  return (
    <section className="banner">
      <div
        className="banner-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div
            className="banner-slide"
            key={i}
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(90,102,243,0.3), rgba(138,148,255,0.3)), url('${s.src}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="overlay">
              <h1>{s.title}</h1>
              <p>{s.subtitle}</p>
              <a className="btn-fill" href="#comece">
                Começar Agora
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="banner-controls">
        <button onClick={handlePrev} aria-label="Slide anterior">
          ‹
        </button>
        <button onClick={handleNext} aria-label="Próximo slide">
          ›
        </button>
      </div>
    </section>
  );
}
