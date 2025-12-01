import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ItemPage.css";

function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [creatorName, setCreatorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchItem() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get(`/patrimonios/${id}`);
        if (mounted) setItem(data);
        // Buscar nome do usuário criador
        if (data && data.criado_por) {
          try {
            const user = await api.get(`/usuarios/${data.criado_por}`);
            if (user && user.email && mounted) setCreatorName(user.email);
            else if (mounted) setCreatorName("");
          } catch {
            if (mounted) setCreatorName("");
          }
        } else if (mounted) setCreatorName("");
      } catch (err) {
        setError("Erro ao carregar patrimônio");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (id) fetchItem();
    return () => { mounted = false; };
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    // Substitua por chamada real de API
    console.log("Salvando item:", item);
    alert("Alterações salvas (simulado)");
  }

  function handleDelete() {
    const ok = window.confirm(
      "Tem certeza que deseja deletar este patrimônio?"
    );
    if (!ok) return;
    // Chamada real de API para deletar aqui
    console.log("Deletando item id=", item.id);
    alert("Patrimônio deletado (simulado)");
    navigate("/home");
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${pad(d.getFullYear())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  if (loading) return <div className="page-wrap">Carregando...</div>;
  if (error) return <div className="page-wrap">{error}</div>;
  if (!item) return <div className="page-wrap">Patrimônio não encontrado</div>;

  return (
    <div className="page-wrap">
      <div className="item-page">
        <header className="item-header">
          <h2 className="item-name">{item.nome}</h2>
          <div className="item-code">{item.identificacao_fisica}</div>
        </header>

        <form className="item-form" onSubmit={handleSave}>
          <div className="form-row">
            <label htmlFor="location">Localização</label>
            <input
              id="location"
              name="localizacao"
              value={item.localizacao || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={item.status || ""}
              onChange={handleChange}
            >
              <option>Ativo</option>
              <option>Inativo</option>
              <option>Em manutenção</option>
              <option>Perdido</option>
            </select>
          </div>

          <fieldset className="readonly-group" disabled>
            <div className="form-row">
              <label>Data de criação</label>
              <input value={formatDate(item.created_at || "")} readOnly />
            </div>

            <div className="form-row">
              <label>Usuário que criou</label>
              <input value={creatorName} readOnly />
            </div>
          </fieldset>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Salvar alterações
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Deletar patrimônio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemPage;
