import React, { useState } from "react";
import "./AssetsPage.css";
import { useNavigate } from "react-router-dom";

function AlmoxarifadoPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Exemplo de dados
  const [almoxarifado] = useState([
    {
      nome: "Mesa com 6 lugares",
      codigo: "001",
      localizacao: "Refeitório",
      dataValidade: "2025-12-31",
    },
    {
      nome: "Cadeira",
      codigo: "002",
      localizacao: "Refeitório",
      dataValidade: "2026-06-30",
    },
    {
      nome: "Aspirador de pó",
      codigo: "003",
      localizacao: "Depósito",
      dataValidade: "2024-11-15",
    },
  ]);

  const filtrados = almoxarifado.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

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

      <table className="tabela-patrimonios">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Código</th>
            <th>Localização</th>
            <th>Data de validade</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((p, index) => (
            <tr key={index}>
              <td>{p.nome}</td>
              <td>{p.codigo}</td>
              <td>{p.localizacao}</td>
              <td>{p.dataValidade}</td>
            </tr>
          ))}
          {filtrados.length === 0 && (
            <tr>
              <td colSpan="4" className="sem-resultados">
                Nenhum item encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AlmoxarifadoPage;
