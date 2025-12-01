import "./NewAssetPage.css";

function NewAssetsPage() {
  return (
    <main className="assets-content">
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
        <input
          type="text"
          placeholder="Insira o status do patrimônio"
          className="campo"
        />
      </div>

      <div style={{display: "flex", justifyContent: "space-between"}}>
        <button className="botao-primario">Adicionar Patrimônio</button>
        <button className="botao-danger">Cancelar</button>
      </div>

    </main>
  );
}

export default NewAssetsPage;
