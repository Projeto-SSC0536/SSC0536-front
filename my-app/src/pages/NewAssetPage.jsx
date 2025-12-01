import "./NewAssetPage.css";

function NewAssetsPage() {
  return (
    <main className="new-assets-content">
      <h1 className="titulo">Novo patrimônio</h1>

      <div className="campos-container">
        <h4 className="h4">Nome</h4>
        <input
          type="text"
          placeholder="Insira o nome do patrimônio"
          className="campo"
        />

        <h4 className="h4">Código</h4>
        <input
          type="text"
          placeholder="Insira o código do patrimônio"
          className="campo"
        />

        <h4 className="h4">Localização</h4>
        <input
          type="text"
          placeholder="Insira a localização do patrimônio"
          className="campo"
        />

        <h4 className="h4">Status</h4>
        <select id="status" name="status" className="campo">
          <option value="" selected disabled>Insira o status do patrimônio</option>
          <option>Ativo</option>
          <option>Inativo</option>
          <option>Em manutenção</option>
          <option>Perdido</option>
        </select>
      </div>

      <div className="form-actions">
        <button className="botao-primario">Adicionar Patrimônio</button>
        <div style={{height: "12px"}}></div>
        <button className="botao-danger">Cancelar</button>
      </div>
    </main>
  );
}

export default NewAssetsPage;
