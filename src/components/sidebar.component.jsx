import "./sidebar.style.css";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleExpand = (categoryId) => {
    setExpanded((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [patrimonios, almoxarifado] = await Promise.all([
          api.get("/patrimonios"),
          api.get("/almoxarifado").catch(() => [])
        ]);
        
        if (mounted) {
          const categoriesData = [
            {
              id: "patrimonios",
              name: "Patrimônios",
              items: Array.isArray(patrimonios) 
                ? patrimonios.map(p => ({
                    id: p.id || p.codigo,
                    name: p.nome || p.identificacao_fisica || "Sem nome"
                  }))
                : []
            },
            {
              id: "almoxarifado",
              name: "Almoxarifado",
              items: Array.isArray(almoxarifado)
                ? almoxarifado.map(a => ({
                    id: a.id || a.codigo,
                    name: a.nome || a.descricao || "Sem nome"
                  }))
                : []
            }
          ];
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error("Erro ao carregar dados da sidebar:", err);
        if (mounted) {
          setCategories([
            { id: "patrimonios", name: "Patrimônios", items: [] },
            { id: "almoxarifado", name: "Almoxarifado", items: [] }
          ]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, [refreshKey]);

  // Ouve eventos globais para atualizar a lista (ex.: após deletar/criar)
  useEffect(() => {
    const onRefresh = () => setRefreshKey((k) => k + 1);
    window.addEventListener("patrimonios:refresh", onRefresh);
    return () => window.removeEventListener("patrimonios:refresh", onRefresh);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="container">
      <button
        className="hamburger"
        ref={buttonRef}
        onClick={() => setOpen(!open)}
      >
        <Menu size={24} />
      </button>

      <nav ref={sidebarRef} className={`sidebar ${open ? "open" : ""}`}>
        <ul>
          {loading ? (
            <li className="category">
              <span style={{ padding: "1rem" }}>Carregando...</span>
            </li>
          ) : (
            categories.map((cat) => (
            <li key={cat.id} className="category">
              <div
                className="category-header"
                onClick={() => navigate(`/${cat.id}`)}
              >
                <span>{cat.name}</span>
                <button
                  className="expand-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(cat.id);
                  }}
                >
                  {expanded.includes(cat.id) ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              </div>

              {expanded.includes(cat.id) && (
                <ul className="sub-items">
                  {cat.items.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => navigate(`/${cat.id}/${item.id}`)}
                      className="sub-item"
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            ))
          )}
        </ul>
      </nav>
    </div>
  );
}
