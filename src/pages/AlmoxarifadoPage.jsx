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
  const [expiredOnly, setExpiredOnly] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef(null);

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

  useEffect(() => {
    function handleDocClick(e) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) {
        setFilterMenuOpen(false);
      }
    }
    if (filterMenuOpen) document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [filterMenuOpen]);

  const isExpired = (item) => {
    if (!item || !item.data_validade) return false;
    const d = new Date(item.data_validade);
    if (Number.isNaN(d.getTime())) return false;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return d < todayStart;
  };

  const filtrados = assets
    .filter((p) => (p.nome || "").toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (expiredOnly ? isExpired(p) : true));

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
        <div className="search-group">
          <input
            type="text"
            placeholder="Buscar item..."
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
                  <li role="menuitem">
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
                        checked={expiredOnly}
                        onChange={() => setExpiredOnly((s) => !s)}
                      />
                      Mostrar itens expirados
                    </label>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
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
