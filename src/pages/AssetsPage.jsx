import React, { useState } from "react";
import "./AssetsPage.css";
import { useNavigate } from "react-router-dom";

function AssetsPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Exemplo de dados
  const [patrimonios] = useState([
    { nome: "Mesa com 6 lugares", codigo: "001", localizacao: "Refeitório", status: "Ativo" },
    { nome: "Cadeira", codigo: "002", localizacao: "Refeitório", status: "Ativo" },
    { nome: "Aspirador de pó", codigo: "003", localizacao: "Depósito", status: "Em manutenção" },
  ]);

  const filtrados = patrimonios.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="assets-content">
      <h1 className="titulo">Patrimônios</h1>

      <div className="linha-superior">
        <input
          type="text"
          placeholder="Buscar patrimônio..."
          className="barra-busca"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="botao-primario" onClick={() => navigate("/patrimonios/novo")}>Adicionar Patrimônio</button>
      </div>

      <table className="tabela-patrimonios">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Código</th>
            <th>Localização</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((p, index) => (
            <tr key={index}>
              <td>{p.nome}</td>
              <td>{p.codigo}</td>
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
    </main>
  );
}

export default AssetsPage;
