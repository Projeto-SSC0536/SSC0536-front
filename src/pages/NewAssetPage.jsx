import "./NewAssetPage.css";
import { useState } from "react";
import Select from "react-select";
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
    <div className="new-assets-content">
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
        <div style={{ width: "100%" }}>
          <Select
            inputId="status"
            name="status_select"
            classNamePrefix="react-select"
            className="react-select-container"
            value={
              [
                { value: "ativo", label: "Ativo" },
                { value: "inativo", label: "Inativo" },
                { value: "manutenção", label: "Manutenção" },
                { value: "quebrado", label: "Quebrado" },
              ].find((o) => o.value === status) || null
            }
            onChange={(opt) => setStatus(opt ? opt.value : "")}
            options={[
              { value: "ativo", label: "Ativo" },
              { value: "inativo", label: "Inativo" },
              { value: "manutenção", label: "Manutenção" },
              { value: "quebrado", label: "Quebrado" },
            ]}
            placeholder="Insira o status do patrimônio"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              control: (base) => ({
                ...base,
                borderRadius: 4,
                borderColor: "#ccc",
                minHeight: 44,
                boxShadow: "none",
              }),
              valueContainer: (base) => ({ ...base, padding: "0 8px" }),
              placeholder: (base) => ({
                ...base,
                color: "#666",
                marginLeft: 2,
              }),
            }}
          />
          <input type="hidden" name="status" value={status} required />
        </div>

        {error && <div className="erro">{error.message || String(error)}</div>}

        <div className="botoes-container">
          <button className="botao-primario" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Adicionar Patrimônio"}
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

export default NewAssetsPage;
