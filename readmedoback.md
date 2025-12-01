Para criar o banco de dados:

Baixar Docker-Desktop
Rodar "docker-compose up -d --build" na pasta do banco de dados
📥 População de teste
O script popula_base.sh na raiz insere dados de teste (usuários, almoxarifado e patrimônios). Use apenas em ambiente de desenvolvimento/testes.

Rápido:

chmod +x ./popula_base.sh
./popula_base.sh   # ou: bash ./popula_base.sh
O script faz requisições para http://localhost:8080/api. Se a API não estiver exposta no host ajuste a URL ou execute o script de dentro de um container com acesso à rede do Compose.

📡 Endpoints da API
A API segue o padrão RESTful e responde em JSON.
O prefixo base é:

http://localhost:8080/api
🔹 Autenticação
POST /api/login
Autentica um usuário com nome e senha.

Body JSON:

{
  "nome": "string",
  "senha": "string"
}
Respostas:

200 OK – Autenticação bem-sucedida.
{
  "id": 1,
  "nome": "Alice",
  "cargo": "Cientista",
  "created_at": "2025-11-10T21:03:00Z",
  "updated_at": "2025-11-10T21:03:00Z"
}
401 Unauthorized – Nome ou senha incorretos.
{"error": "nome ou senha incorretos"}
🔹 Usuários
Método	Rota	Descrição
GET	/usuarios	Lista todos os usuários
POST	/usuarios	Cria um novo usuário
GET	/usuarios/{id}	Busca um usuário específico
PUT	/usuarios/{id}	Atualiza dados parciais de um usuário
DELETE	/usuarios/{id}	Remove um usuário
Corpo do POST:

{
  "nome": "string",
  "senha": "string",
  "cargo": "string"
}
Corpo do PUT:

{
  "nome": "string (opcional)",
  "senha": "string (opcional)",
  "cargo": "string (opcional)"
}
Respostas comuns:

200 OK – Retorna o objeto atualizado.
201 Created – Novo usuário criado.
400 Bad Request – Campos obrigatórios ausentes.
404 Not Found – Usuário não encontrado.
🔹 Almoxarifado
Método	Rota	Descrição
GET	/almoxarifado	Lista todos os itens
POST	/almoxarifado	Cria um novo item
GET	/almoxarifado/{id}	Busca um item específico
PUT	/almoxarifado/{id}	Atualiza dados de um item
DELETE	/almoxarifado/{id}	Remove um item
Corpo do POST:

{
  "nome": "string",
  "categoria": "string",
  "data_validade": "YYYY-MM-DD (opcional)",
  "criado_por": 1
}
Corpo do PUT:

{
  "nome": "string (opcional)",
  "categoria": "string (opcional)",
  "data_validade": "YYYY-MM-DD (opcional)",
  "data_saida": "YYYY-MM-DD (opcional)"
}
🔹 Patrimônios
Método	Rota	Descrição
GET	/patrimonios	Lista todos os patrimônios
POST	/patrimonios	Cria um novo patrimônio
GET	/patrimonios/{id}	Busca um patrimônio específico
PUT	/patrimonios/{id}	Atualiza dados de um patrimônio
DELETE	/patrimonios/{id}	Remove um patrimônio
Corpo do POST:

{
  "nome": "string",
  "identificacao_fisica": "string única",
  "localizacao": "string",
  "status": "string (ativo, inativo, etc.)",
  "criado_por": 1
}
Corpo do PUT:

{
  "nome": "string (opcional)",
  "identificacao_fisica": "string (opcional)",
  "localizacao": "string (opcional)",
  "status": "string (opcional)",
  "data_saida": "YYYY-MM-DD (opcional)"
}
Respostas comuns:

200 OK – Atualização bem-sucedida.
201 Created – Patrimônio criado.
400 Bad Request – Erro de validação.
404 Not Found – Registro não encontrado.
🔹 Health Check
GET /healthz
Retorna o status do servidor.

Resposta:

{"status": "ok"}
⚙️ Notas gerais para o frontend
Todos os endpoints retornam e aceitam JSON UTF-8.
Nenhum campo retorna senha.
Datas seguem o formato ISO 8601 (YYYY-MM-DD).
Para erros, o corpo da resposta contém:
{"error": "mensagem descritiva"}
O CORS está liberado para qualquer origem (ajustável no backend).