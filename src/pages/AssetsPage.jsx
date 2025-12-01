import { useState, useEffect, useRef } from "react";
import "./AssetsPage.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Filter } from "lucide-react";

function AssetsPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

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

  useEffect(() => {
    function handleDocClick(e) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) {
        setFilterMenuOpen(false);
      }
    }
    if (filterMenuOpen) document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [filterMenuOpen]);

  const statuses = Array.from(
    new Set(
      assets.map((a) => (a.status ? String(a.status) : "")).filter(Boolean)
    )
  );

  const filtrados = assets
    .filter((p) => (p.nome || "").toLowerCase().includes(search.toLowerCase()))
    .filter((p) =>
      selectedStatuses.length > 0 ? selectedStatuses.includes(p.status) : true
    );

  return (
    <div className="assets-content">
      <h1 className="titulo">Patrimônios</h1>

      <div className="linha-superior">
        <div className="search-group">
          <input
            type="text"
            placeholder="Buscar patrimônio..."
            className="barra-busca"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-container" ref={filterMenuRef}>
            <button
              className="icon-button"
              onClick={() => setFilterMenuOpen((s) => !s)}
              aria-expanded={filterMenuOpen}
              aria-haspopup="menu"
              title="Abrir filtros"
            >
              <Filter size={16} />
            </button>
            {filterMenuOpen && (
              <div className="filter-menu" role="menu" aria-label="Filtros">
                <ul>
                  {statuses.length === 0 && (
                    <li className="sem-resultados">Sem status disponíveis</li>
                  )}
                  {statuses.map((s) => (
                    <li key={s} role="menuitem">
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(s)}
                          onChange={() => {
                            setSelectedStatuses((prev) =>
                              prev.includes(s)
                                ? prev.filter((x) => x !== s)
                                : [...prev, s]
                            );
                          }}
                        />
                        {s}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
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
                <td
                  onClick={() => p.id && navigate(`/patrimonios/${p.id}`)}
                  style={{ cursor: p.id ? "pointer" : "default" }}
                  title={p.id ? "Ver detalhes do patrimônio" : undefined}
                >
                  {p.nome}
                </td>
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
