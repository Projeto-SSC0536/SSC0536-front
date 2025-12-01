import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ItemPage.css";

function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simulated item state. In a real app you'd fetch this by id.
  const [item, setItem] = useState({
    id: id || "1",
    name: "Nome do patrimônio",
    code: "COD-0001",
    location: "Depósito A",
    status: "Ativo",
    createdAt: "2025-10-01 14:32",
    createdBy: "fulano",
  });

  useEffect(() => {
    // Aqui você poderia buscar os dados do item por `id`.
    // Ex: fetch(`/api/items/${id}`).then(...)
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

  return (
    <div className="page-wrap">
      <div className="item-page">
        <header className="item-header">
          <h2 className="item-name">{item.name}</h2>
          <div className="item-code">{item.code}</div>
        </header>

        <form className="item-form" onSubmit={handleSave}>
          <div className="form-row">
            <label htmlFor="location">Localização</label>
            <input
              id="location"
              name="location"
              value={item.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={item.status}
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
              <input value={item.createdAt} readOnly />
            </div>

            <div className="form-row">
              <label>Usuário que criou</label>
              <input value={item.createdBy} readOnly />
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
