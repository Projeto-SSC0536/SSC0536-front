import "./NewAssetPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function NewAssetsPage() {
  const [nome, setNome] = useState("");
  const [identificacao, setIdentificacao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!nome || !identificacao || !localizacao || !status) {
      setError(new Error("Preencha todos os campos obrigatórios."));
      return;
    }
    setLoading(true);
    try {
      const body = {
        nome,
        identificacao_fisica: identificacao,
        localizacao,
        status: status.toLowerCase(),
        criado_por: 1,
      };
      await api.post("/patrimonios", body);
      navigate("/patrimonios");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="new-assets-content">
      <h1 className="titulo">Novo patrimônio</h1>

      <form className="campos-container" onSubmit={handleSubmit}>
        <label className="h4">Nome *</label>
        <input
          type="text"
          placeholder="Insira o nome do patrimônio"
          className="campo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label className="h4">Identificação física *</label>
        <input
          type="text"
          placeholder="Identificação única"
          className="campo"
          value={identificacao}
          onChange={(e) => setIdentificacao(e.target.value)}
        />

        <label className="h4">Localização *</label>
        <input
          type="text"
          placeholder="Insira a localização do patrimônio"
          className="campo"
          value={localizacao}
          onChange={(e) => setLocalizacao(e.target.value)}
        />

        <label className="h4">Status *</label>
        <select
          id="status"
          name="status"
          className="campo"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="" disabled>
            Insira o status do patrimônio
          </option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="em manutenção">Em manutenção</option>
          <option value="perdido">Perdido</option>
        </select>

        {error && <div className="erro">{error.message || String(error)}</div>}

        <div className="form-actions">
          <button className="botao-primario" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Adicionar Patrimônio"}
          </button>
          <div style={{ height: "12px" }}></div>
          <button
            type="button"
            className="botao-danger"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}

export default NewAssetsPage;
