import "./NewAssetPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function NewAlmoxarifadoPage() {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!nome || !categoria) {
      setError(new Error("Preencha os campos obrigatórios: nome e categoria."));
      return;
    }
    setLoading(true);
    try {
      const body = {
        nome,
        categoria,
        criado_por: 1,
      };
      if (dataValidade) {
        const clean = String(dataValidade).trim();
        body.data_validade = `${clean}T00:00:00Z`;
      }
      await api.post("/almoxarifado", body);
      window.dispatchEvent(new Event("almoxarifado:refresh"));
      navigate("/almoxarifado");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="new-assets-content">
      <h1 className="titulo">Novo item do Almoxarifado</h1>

      <form className="campos-container" onSubmit={handleSubmit}>
        <label className="h4">Nome *</label>
        <input
          type="text"
          placeholder="Nome do item"
          className="campo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label className="h4">Categoria *</label>
        <input
          type="text"
          placeholder="Categoria do item"
          className="campo"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />

        <label className="h4">Data de validade</label>
        <input
          type="date"
          className="campo"
          value={dataValidade}
          onChange={(e) => setDataValidade(e.target.value)}
        />

        {error && <div className="erro">{error.message || String(error)}</div>}

        <div className="botoes-container">
          <button className="botao-primario" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Adicionar Item"}
          </button>
          <button
            type="button"
            className="botao-danger"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewAlmoxarifadoPage;
