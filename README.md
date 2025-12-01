# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Como executar com Docker Compose (desenvolvimento)

Se preferir rodar a aplicação em um contêiner (recomendado para evitar problemas de versão do Node), siga estes passos:

1. Instale o Docker e o Docker Compose na sua máquina.
2. No diretório raiz do repositório, execute:

```bash
docker compose up --build
```

3. Aguarde a build e a instalação das dependências dentro do contêiner. O Vite será iniciado e ficará disponível em:

```
http://localhost:5173
```

Observações:
- O serviço expõe a porta padrão do Vite (5173). Se essa porta estiver ocupada, pare o processo ou altere o mapeamento em `docker-compose.yml`.
- O `docker-compose.yml` monta o diretório do projeto na imagem, permitindo edição de arquivos no host com hot-reload (HMR).
- Para parar o contêiner e remover recursos criados pelo Compose, use:

```bash
docker compose down
```

Para produção, gere o build com `npm run build` e sirva os arquivos estáticos a partir de um servidor (por exemplo, `nginx`). Posso adicionar um Dockerfile de produção se desejar.
