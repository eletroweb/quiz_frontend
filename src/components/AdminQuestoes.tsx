import React, { useState, useEffect } from "react";
import axios from "axios";

interface Questao {
  id: string;
  text: string;
  image_url?: string;
  choices: string[];
  correct_index: number;
  explanation?: string;
  materia_id?: number;
  concurso_id?: number;
  type: "mc" | "tf";
  banca?: string;
  ano?: number;
  dificuldade?: "facil" | "medio" | "dificil";
}

interface FormData {
  text: string;
  image_url: string;
  choices: string[];
  correct_index: number;
  explanation: string;
  materia_id: string;
  concurso_id: string;
  type: "mc" | "tf";
  banca: string;
  ano: string;
  dificuldade: "facil" | "medio" | "dificil";
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function AdminQuestoes() {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    text: "",
    image_url: "",
    choices: ["", "", "", ""],
    correct_index: 0,
    explanation: "",
    materia_id: "",
    concurso_id: "",
    type: "mc",
    banca: "",
    ano: "",
    dificuldade: "medio",
  });

  useEffect(() => {
    carregarQuestoes();
  }, []);

  useEffect(() => {
    // Quando mudar tipo para tf, deixar apenas 2 opções
    if (form.type === "tf") {
      setForm((prev) => ({
        ...prev,
        choices: ["Certo", "Errado"],
        correct_index: 0,
      }));
    } else {
      // Quando mudar para mc, deixar 4 opções
      if (form.choices.length !== 4 && form.choices.length !== 5) {
        setForm((prev) => ({
          ...prev,
          choices: ["", "", "", ""],
        }));
      }
    }
  }, [form.type]);

  const carregarQuestoes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/questoes?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestoes(response.data);
    } catch (error) {
      console.error("Erro ao carregar questões:", error);
      alert("Erro ao carregar questões");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (newType: "mc" | "tf") => {
    setForm((prev) => ({
      ...prev,
      type: newType,
      correct_index: 0,
    }));
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...form.choices];
    newChoices[index] = value;
    setForm((prev) => ({
      ...prev,
      choices: newChoices,
    }));
  };

  const handleNumAlternativas = (num: number) => {
    if (form.type === "mc") {
      const newChoices = Array(num).fill("");
      newChoices.forEach((_, i) => {
        newChoices[i] = form.choices[i] || "";
      });
      setForm((prev) => ({
        ...prev,
        choices: newChoices,
        correct_index: Math.min(prev.correct_index, num - 1),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.text.trim()) {
      alert("Digite a questão");
      return;
    }

    if (form.choices.some((c) => !c.trim())) {
      alert("Todas as alternativas devem ser preenchidas");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        ...form,
        materia_id: form.materia_id ? parseInt(form.materia_id) : null,
        concurso_id: form.concurso_id ? parseInt(form.concurso_id) : null,
        ano: form.ano ? parseInt(form.ano) : null,
      };

      if (editingId) {
        await axios.put(`${API_URL}/questoes/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Questão atualizada com sucesso!");
      } else {
        await axios.post(`${API_URL}/questoes`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Questão criada com sucesso!");
      }

      resetForm();
      carregarQuestoes();
    } catch (error) {
      console.error("Erro ao salvar questão:", error);
      alert("Erro ao salvar questão");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (questao: Questao) => {
    setForm({
      text: questao.text,
      image_url: questao.image_url || "",
      choices: questao.choices,
      correct_index: questao.correct_index,
      explanation: questao.explanation || "",
      materia_id: questao.materia_id?.toString() || "",
      concurso_id: questao.concurso_id?.toString() || "",
      type: questao.type,
      banca: questao.banca || "",
      ano: questao.ano?.toString() || "",
      dificuldade: questao.dificuldade || "medio",
    });
    setEditingId(questao.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/questoes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Questão deletada!");
      carregarQuestoes();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar questão");
    }
  };

  const resetForm = () => {
    setForm({
      text: "",
      image_url: "",
      choices: ["", "", "", ""],
      correct_index: 0,
      explanation: "",
      materia_id: "",
      concurso_id: "",
      type: "mc",
      banca: "",
      ano: "",
      dificuldade: "medio",
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="admin-questoes">
      <h1>Gerenciar Questões</h1>

      <button
        className="btn-fill"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: "20px" }}
      >
        {showForm ? "❌ Cancelar" : "➕ Nova Questão"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="question-form">
          <div className="form-group">
            <label>Tipo de Questão</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`toggle-btn ${form.type === "mc" ? "active" : ""}`}
                onClick={() => handleTypeChange("mc")}
              >
                📝 Múltiplas Alternativas
              </button>
              <button
                type="button"
                className={`toggle-btn ${form.type === "tf" ? "active" : ""}`}
                onClick={() => handleTypeChange("tf")}
              >
                ✓✗ Certo/Errado
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Texto da Questão *</label>
            <textarea
              value={form.text}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, text: e.target.value }))
              }
              placeholder="Digite a questão..."
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label>Imagem (URL)</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, image_url: e.target.value }))
              }
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          {form.type === "mc" && (
            <>
              <div className="form-group">
                <label>Número de Alternativas</label>
                <div className="alternatives-buttons">
                  <button
                    type="button"
                    className={`alt-btn ${
                      form.choices.length === 4 ? "active" : ""
                    }`}
                    onClick={() => handleNumAlternativas(4)}
                  >
                    4 Alternativas
                  </button>
                  <button
                    type="button"
                    className={`alt-btn ${
                      form.choices.length === 5 ? "active" : ""
                    }`}
                    onClick={() => handleNumAlternativas(5)}
                  >
                    5 Alternativas
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Alternativas</label>
            <div className="choices-container">
              {form.choices.map((choice, index) => (
                <div key={index} className="choice-input">
                  <input
                    type="radio"
                    name="correct"
                    checked={form.correct_index === index}
                    onChange={() =>
                      setForm((prev) => ({ ...prev, correct_index: index }))
                    }
                    disabled={form.type === "tf" && form.choices.length === 2}
                  />
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                    placeholder={
                      form.type === "tf"
                        ? index === 0
                          ? "Certo"
                          : "Errado"
                        : `Alternativa ${String.fromCharCode(65 + index)}`
                    }
                    disabled={form.type === "tf"}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Explicação</label>
            <textarea
              value={form.explanation}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, explanation: e.target.value }))
              }
              placeholder="Explicação da resposta correta..."
              rows={2}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Matéria (ID)</label>
              <input
                type="number"
                value={form.materia_id}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, materia_id: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label>Concurso (ID)</label>
              <input
                type="number"
                value={form.concurso_id}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, concurso_id: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Banca</label>
              <input
                type="text"
                value={form.banca}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, banca: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label>Ano</label>
              <input
                type="number"
                value={form.ano}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, ano: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label>Dificuldade</label>
              <select
                value={form.dificuldade}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    dificuldade: e.target.value as any,
                  }))
                }
              >
                <option value="facil">Fácil</option>
                <option value="medio">Médio</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-fill" disabled={loading}>
            {loading
              ? "Salvando..."
              : editingId
              ? "Atualizar"
              : "Criar Questão"}
          </button>
        </form>
      )}

      <div className="questoes-list">
        <h2>Questões ({questoes.length})</h2>
        {loading && <p>Carregando...</p>}
        {questoes.map((questao) => (
          <div key={questao.id} className="questao-card">
            <div className="questao-header">
              <span className="type-badge">
                {questao.type === "tf" ? "✓✗ V/F" : "📝 MC"}
              </span>
              <span className="difficulty-badge">{questao.dificuldade}</span>
              {questao.banca && (
                <span className="banca-badge">{questao.banca}</span>
              )}
            </div>
            <p className="questao-text">{questao.text}</p>
            <div className="choices-display">
              {questao.choices.map((choice, i) => (
                <div
                  key={i}
                  className={`choice ${
                    i === questao.correct_index ? "correct" : ""
                  }`}
                >
                  {String.fromCharCode(65 + i)}) {choice}
                </div>
              ))}
            </div>
            <div className="questao-actions">
              <button
                className="btn-outline"
                onClick={() => handleEdit(questao)}
              >
                ✏️ Editar
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDelete(questao.id)}
              >
                🗑️ Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
