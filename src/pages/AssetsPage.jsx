import { useState, useEffect } from "react";
import "./AssetsPage.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AssetsPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get("/patrimonios");
        if (mounted) setAssets(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtrados = assets.filter((p) =>
    (p.nome || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="assets-content">
      <h1 className="titulo">Patrimônios</h1>

      <div className="linha-superior">
        <input
          type="text"
          placeholder="Buscar patrimônio..."
          className="barra-busca"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="botao-primario"
          onClick={() => navigate("/patrimonios/novo")}
        >
          Adicionar Patrimônio
        </button>
      </div>

      {loading ? (
        <div className="carregando">Carregando patrimônios...</div>
      ) : error ? (
        <div className="erro">
          Erro ao carregar: {error.message || String(error)}
        </div>
      ) : (
        <table className="tabela-patrimonios">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Identificação</th>
              <th>Localização</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p, index) => (
              <tr key={p.id ?? index}>
                <td>{p.nome}</td>
                <td>{p.identificacao_fisica || p.codigo}</td>
                <td>{p.localizacao}</td>
                <td>{p.status}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan="4" className="sem-resultados">
                  Nenhum patrimônio encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AssetsPage;
