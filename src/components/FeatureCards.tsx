import React from 'react'

const feats = [
  { icon: '🎓', title: '10.000+ Questões', desc: 'Banco de dados com milhares de questões comentadas para treinar.' },
  { icon: '🧪', title: 'Simulados Realistas', desc: 'Pratique com simulados que replicam as condições reais das provas.' },
  { icon: '🏆', title: 'Ranking Nacional', desc: 'Compare seu desempenho com outros candidatos em tempo real.' },
]

export default function FeatureCards() {
  return (
    <div className="cards">
      {feats.map((f, i) => (
        <div className="card" key={i}>
          <div className="icon">{f.icon}</div>
          <div className="title">{f.title}</div>
          <div className="desc">{f.desc}</div>
        </div>
      ))}
    </div>
  )
}
