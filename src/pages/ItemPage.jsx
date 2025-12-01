import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "./ItemPage.css";

function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determina o tipo baseado na URL
  const isAlmoxarifado = location.pathname.startsWith('/almoxarifado');
  const itemType = isAlmoxarifado ? 'almoxarifado' : 'patrimonios';

  const [item, setItem] = useState(null);
  const [creatorName, setCreatorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchItem() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get(`/${itemType}/${id}`);
        // Usa apenas data_validade para almoxarifado
        const normalized = isAlmoxarifado
          ? { ...data, data_validade: data.data_validade || "" }
          : data;
        if (mounted) setItem(normalized);
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
      } catch {
        setError(`Erro ao carregar ${isAlmoxarifado ? 'item' : 'patrimônio'}`);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (id) fetchItem();
    return () => { mounted = false; };
  }, [id, itemType, isAlmoxarifado]);

  function handleChange(e) {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!item) return;
    try {
      setSaving(true);
      // Converte para ISO 8601 com milissegundos (YYYY-MM-DDTHH:MM:SS.sssZ)
      const toISOZ = (val) => {
        if (!val) return "";
        // 1) YYYY-MM-DD → UTC meia-noite
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
          return `${val}T00:00:00.000Z`;
        }
        // 2) DD/MM/YYYY → UTC meia-noite
        const m = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (m) {
          const [_, dd, mm, yyyy] = m;
          return `${yyyy}-${mm}-${dd}T00:00:00.000Z`;
        }
        // 3) Tenta parsear normalmente
        const d = new Date(val);
        return isNaN(d) ? String(val) : d.toISOString();
      };

      const payload = isAlmoxarifado 
        ? {
            categoria: item.categoria,
            data_validade: toISOZ(item.data_validade),
          }
        : {
            localizacao: item.localizacao,
            status: item.status,
          };
      await api.put(`/${itemType}/${id}`, payload);
      // Refaz o GET para confirmar persistência e sincronizar com o backend
      try {
        const updated = await api.get(`/${itemType}/${id}`);
        const normalizedUpdated = isAlmoxarifado
          ? { ...updated, data_validade: updated.data_validade || "" }
          : updated;
        setItem(normalizedUpdated);
      } catch { /* ignore re-fetch errors */ }
      // Atualiza sidebar caso nome/categoria mudem
      window.dispatchEvent(new Event('patrimonios:refresh'));
      alert("Alterações salvas com sucesso!");
    } catch {
      alert("Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const ok = window.confirm(
      `Tem certeza que deseja deletar este ${isAlmoxarifado ? 'item' : 'patrimônio'}?`
    );
    if (!ok) return;
    try {
      setDeleting(true);
      await api.del(`/${itemType}/${id}`);
      // Notifica a sidebar para recarregar a lista
      window.dispatchEvent(new Event('patrimonios:refresh'));
      alert(`${isAlmoxarifado ? 'Item' : 'Patrimônio'} deletado com sucesso!`);
      navigate(`/${itemType}`);
    } catch {
      alert(`Erro ao deletar ${isAlmoxarifado ? 'item' : 'patrimônio'}.`);
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function formatDateOnly(dateString) {
    if (!dateString) return "";
    // Preferir componentes UTC para evitar "dia anterior/seguinte" por fuso
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  }

  if (loading) return <div className="page-wrap">Carregando...</div>;
  if (error) return <div className="page-wrap">{error}</div>;
  if (!item) return <div className="page-wrap">{isAlmoxarifado ? 'Item' : 'Patrimônio'} não encontrado</div>;

  return (
    <div className="page-wrap">
      <div className="item-page">
        <header className="item-header">
          <h2 className="item-name">{item.nome}</h2>
          <div className="item-code">{isAlmoxarifado ? `ID: ${item.id}` : item.identificacao_fisica}</div>
        </header>

        <form className="item-form" onSubmit={handleSave}>
          {isAlmoxarifado ? (
            <>
              <div className="form-row">
                <label htmlFor="categoria">Categoria</label>
                <input
                  id="categoria"
                  name="categoria"
                  value={item.categoria || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <label htmlFor="data_validade">Data de Validade</label>
                <input
                  id="data_validade"
                  name="data_validade"
                  type="date"
                  value={formatDateOnly(item.data_validade)}
                  onChange={handleChange}
                />
              </div>
            </>
          ) : (
            <>
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
            </>
          )}

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
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deletando..." : `Deletar ${isAlmoxarifado ? 'item' : 'patrimônio'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemPage;
