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
        const data = await api.get("/almoxarifado");
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

  const formatDate = (iso) => {
    if (!iso) return "";
    const datePart = String(iso).split("T")[0];
    const [year, month, day] = datePart.split("-");
    if (year && month && day) return `${day}/${month}/${year}`;
    return String(iso);
  };

  return (
    <div className="assets-content">
      <h1 className="titulo">Almoxarifado</h1>

      <div className="linha-superior">
        <input
          type="text"
          placeholder="Buscar item..."
          className="barra-busca"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="botao-primario"
          onClick={() => navigate("/almoxarifado/novo")}
        >
          Adicionar Item
        </button>
      </div>

      {loading ? (
        <div className="carregando">Carregando itens...</div>
      ) : error ? (
        <div className="erro">
          Erro ao carregar: {error.message || String(error)}
        </div>
      ) : (
        <table className="tabela-patrimonios">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Data de validade</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p, index) => (
              <tr key={p.id ?? index}>
                <td
                  onClick={() => p.id && navigate(`/almoxarifado/${p.id}`)}
                  style={{ cursor: p.id ? "pointer" : "default" }}
                  title={p.id ? "Ver detalhes do item" : undefined}
                >
                  {p.nome}
                </td>
                <td>{p.categoria}</td>
                <td>{formatDate(p.data_validade)}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan="3" className="sem-resultados">
                  Nenhum item encontrado
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
