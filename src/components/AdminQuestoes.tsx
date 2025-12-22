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
  const [importOpen, setImportOpen] = useState(false);
  const [importItems, setImportItems] = useState<any[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
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

  const normalizeItem = (raw: any) => {
    const choicesArr =
      Array.isArray(raw?.choices)
        ? raw.choices
        : typeof raw?.choices === "string"
        ? raw.choices.split("|").map((s: string) => s.trim()).filter(Boolean)
        : [];
    let type: "mc" | "tf" = raw?.type === "tf" ? "tf" : "mc";
    let choices: string[] = choicesArr;
    if (type === "tf") {
      choices = ["Certo", "Errado"];
    } else {
      if (choices.length !== 4 && choices.length !== 5) {
        choices = ["", "", "", ""];
      }
    }
    let correct_index =
      typeof raw?.correct_index === "number" ? raw.correct_index : 0;
    if (correct_index < 0) correct_index = 0;
    if (correct_index >= choices.length) correct_index = 0;
    return {
      text: String(raw?.text ?? "").trim(),
      image_url: raw?.image_url ?? null,
      choices,
      correct_index,
      explanation: raw?.explanation ?? null,
      materia_id: raw?.materia_id ?? null,
      concurso_id: raw?.concurso_id ?? null,
      banca: raw?.banca ?? null,
      ano: raw?.ano ?? null,
      dificuldade: raw?.dificuldade ?? "medio",
      type,
    };
  };

  const splitCSVLine = (line: string, delim: string) => {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === delim && !inQuotes) {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return [];
    const commaCount = (text.match(/,/g) || []).length;
    const semiCount = (text.match(/;/g) || []).length;
    const delim = semiCount > commaCount ? ";" : ",";
    const headers = splitCSVLine(lines[0], delim).map((h) => h.toLowerCase());
    const items: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = splitCSVLine(lines[i], delim);
      const row: any = {};
      headers.forEach((h, idx) => {
        row[h] = cols[idx];
      });
      items.push(row);
    }
    return items;
  };

  const handleImportFile = async (file: File) => {
    setImportError(null);
    try {
      const text = await file.text();
      let arr: any[] = [];
      const isCSV = /\.csv$/i.test(file.name) || file.type.includes("csv");
      if (isCSV) {
        arr = parseCSV(text);
      } else {
        const parsed = JSON.parse(text);
        arr = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.items) ? parsed.items : [];
      }
      if (!Array.isArray(arr) || arr.length === 0) {
        setImportError("Arquivo JSON inválido ou vazio");
        setImportItems([]);
        return;
      }
      const items = arr.map(normalizeItem).filter((x) => x.text && x.choices.length >= 2);
      setImportItems(items);
    } catch (e: any) {
      setImportError("Falha ao ler o arquivo JSON");
      setImportItems([]);
    }
  };

  const submitImport = async () => {
    if (!importItems.length) {
      alert("Nenhum item válido para importar");
      return;
    }
    try {
      setImportLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/questoes/import`,
        { items: importItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Importação concluída: ${response.data?.imported ?? 0} itens.`);
      setImportItems([]);
      setImportOpen(false);
      carregarQuestoes();
    } catch (e) {
      alert("Erro ao importar questões");
    } finally {
      setImportLoading(false);
    }
  };

  const downloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadJsonTemplate = () => {
    const template = {
      items: [
        {
          text: "Qual a capital do Brasil?",
          choices: ["Brasília", "São Paulo", "Rio de Janeiro", "Salvador"],
          correct_index: 0,
          type: "mc",
          explanation: "Brasília é a capital desde 1960.",
          materia_id: 1,
          banca: "CESPE",
          ano: 2022,
          dificuldade: "facil",
        },
        {
          text: "A água ferve a 100°C ao nível do mar.",
          choices: ["Certo", "Errado"],
          correct_index: 0,
          type: "tf",
          materia_id: 2,
          dificuldade: "medio",
        },
      ],
    };
    downloadFile("questions.json", JSON.stringify(template, null, 2), "application/json");
  };

  const downloadCsvTemplate = () => {
    const header =
      "text,choices,correct_index,type,explanation,materia_id,concurso_id,banca,ano,dificuldade,image_url";
    const rows = [
      [
        "Qual a capital do Brasil?",
        "Brasília|São Paulo|Rio de Janeiro|Salvador",
        "0",
        "mc",
        "Brasília é a capital desde 1960.",
        "1",
        "",
        "CESPE",
        "2022",
        "facil",
        "",
      ],
      [
        "A água ferve a 100°C ao nível do mar.",
        "Certo|Errado",
        "0",
        "tf",
        "No nível do mar, 100°C.",
        "2",
        "",
        "",
        "",
        "medio",
        "",
      ],
    ];
    const esc = (s: string) => {
      const needsQuotes = /[",\n;]/.test(s);
      let out = s.replace(/"/g, '""');
      return needsQuotes ? `"${out}"` : out;
    };
    const delim = ",";
    const content =
      header +
      "\n" +
      rows
        .map((r) => r.map((c) => esc(String(c))).join(delim))
        .join("\n");
    downloadFile("questions.csv", content, "text/csv");
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
      <button
        className="btn-outline"
        onClick={() => setImportOpen(!importOpen)}
        style={{ marginLeft: "10px", marginBottom: "20px" }}
      >
        {importOpen ? "❌ Fechar Importação" : "📥 Importar JSON"}
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

      {importOpen && (
        <div className="import-box" style={{ marginBottom: "20px" }}>
          <h3>Importar Questões via JSON</h3>
          <input
            type="file"
            accept=".json,application/json,.csv,text/csv"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportFile(f);
            }}
          />
          {importError && <p style={{ color: "red" }}>{importError}</p>}
          {importItems.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <p>Itens prontos para importar: {importItems.length}</p>
              <p style={{ fontSize: 12, opacity: 0.8 }}>
                CSV esperado com cabeçalhos: text,choices,correct_index,type,explanation,materia_id,concurso_id,banca,ano,dificuldade,image_url
                — choices pode ser "A|B|C|D|E"
              </p>
              <button
                className="btn-fill"
                onClick={submitImport}
                disabled={importLoading}
              >
                {importLoading ? "Importando..." : "Importar Agora"}
              </button>
              <button
                className="btn-outline"
                style={{ marginLeft: 10 }}
                onClick={downloadJsonTemplate}
              >
                Baixar modelo JSON
              </button>
              <button
                className="btn-outline"
                style={{ marginLeft: 10 }}
                onClick={downloadCsvTemplate}
              >
                Baixar modelo CSV
              </button>
            </div>
          )}
        </div>
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
