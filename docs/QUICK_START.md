# Guia de Início Rápido - PFood Stock

## 🚀 Começando em 5 minutos

### Pré-requisitos
- Node.js 18+ instalado
- PostgreSQL 15+ instalado e rodando
- Git instalado

### Passo 1: Clone o Repositório
```bash
git clone <repository-url>
cd pfood-stock
```

### Passo 2: Configure o Banco de Dados

Crie o banco de dados PostgreSQL:
```bash
createdb pfood_stock
```

Ou via psql:
```sql
CREATE DATABASE pfood_stock;
```

### Passo 3: Configure o Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Copie o arquivo de ambiente
cp .env.example .env

# Edite o .env com suas configurações (opcional se usar valores padrão)
# nano .env

# Inicie o servidor
npm run start:dev
```

O backend estará rodando em `http://localhost:3000`

### Passo 4: Configure o Frontend

Abra um novo terminal:

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Copie o arquivo de ambiente
cp .env.example .env

# Inicie o servidor
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### Passo 5: Crie o Primeiro Usuário

Acesse a documentação Swagger em `http://localhost:3000/api` e execute:

**POST /auth/register**
```json
{
  "name": "Administrador",
  "email": "admin@pfood.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

### Passo 6: Faça Login

Acesse `http://localhost:5173` e faça login com:
- **Email**: admin@pfood.com
- **Password**: admin123

## 🎉 Pronto!

Agora você pode:
1. Criar categorias de produtos
2. Cadastrar produtos
3. Registrar movimentações de estoque
4. Visualizar alertas de estoque baixo
5. Acompanhar estatísticas no dashboard

## 📝 Próximos Passos

### Criar Categorias
1. Acesse "Categorias" no menu lateral
2. Clique em "Nova Categoria"
3. Preencha nome e descrição
4. Salve

Exemplos de categorias:
- Carnes
- Vegetais
- Laticínios
- Bebidas
- Temperos
- Massas
- Grãos

### Cadastrar Produtos
1. Acesse "Produtos" no menu lateral
2. Clique em "Novo Produto"
3. Preencha os dados:
   - Nome do produto
   - Categoria
   - Unidade de medida (kg, litros, unidades)
   - Quantidade atual
   - Quantidade mínima (para alertas)
   - Preço unitário (opcional)
   - SKU (opcional)
   - Data de validade (opcional)
4. Salve

### Registrar Movimentações
1. Acesse "Movimentações" no menu lateral
2. Clique em "Nova Movimentação"
3. Selecione:
   - Produto
   - Tipo (Entrada ou Saída)
   - Quantidade
   - Motivo (opcional)
   - Fornecedor (para entradas)
   - Nota fiscal (opcional)
   - Observações (opcional)
4. Salve

O estoque será atualizado automaticamente!

### Visualizar Alertas
1. Acesse "Alertas" no menu lateral
2. Veja produtos com estoque abaixo do mínimo
3. Alertas críticos (estoque zerado) aparecem em vermelho
4. Alertas de atenção aparecem em amarelo

### Dashboard
O dashboard mostra:
- Total de produtos cadastrados
- Número de alertas ativos
- Valor total do estoque
- Gráfico de movimentações dos últimos 7 dias
- Gráfico de produtos por categoria
- Resumo dos últimos 30 dias

## 🔐 Gerenciar Usuários (apenas ADMIN)

1. Acesse "Usuários" no menu lateral
2. Clique em "Novo Usuário"
3. Preencha os dados e selecione o role:
   - **ADMIN**: Acesso total
   - **MANAGER**: Gerenciar estoque (sem usuários)
   - **OPERATOR**: Apenas visualizar e registrar movimentações
4. Salve

## 🐳 Alternativa: Usar Docker

Se preferir usar Docker:

```bash
# Na raiz do projeto
docker-compose up -d

# Aguarde os containers iniciarem
# Backend: http://localhost:3000
# Frontend: http://localhost:5173
# PostgreSQL: localhost:5432
```

## 🆘 Problemas Comuns

### Backend não inicia
- Verifique se o PostgreSQL está rodando
- Verifique as credenciais no arquivo `.env`
- Verifique se a porta 3000 está disponível

### Frontend não conecta ao backend
- Verifique se o backend está rodando
- Verifique a variável `VITE_API_URL` no `.env` do frontend
- Verifique o console do navegador para erros

### Erro ao criar usuário
- Verifique se o email já não está cadastrado
- Senha deve ter no mínimo 8 caracteres

### Erro 401 (Não autorizado)
- Faça logout e login novamente
- Limpe o localStorage do navegador
- Verifique se o token JWT não expirou

## 📚 Documentação Adicional

- [README.md](../README.md) - Documentação completa
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura do sistema
- [Swagger API](http://localhost:3000/api) - Documentação da API

## 💡 Dicas

1. **Backup**: Faça backup regular do banco de dados
2. **Senhas**: Use senhas fortes em produção
3. **JWT Secret**: Altere o JWT_SECRET em produção
4. **CORS**: Configure o CORS adequadamente em produção
5. **HTTPS**: Use HTTPS em produção

## 🎯 Casos de Uso Comuns

### Recebimento de Mercadoria
1. Acesse "Movimentações"
2. Registre uma ENTRADA
3. Informe fornecedor e nota fiscal
4. O estoque é atualizado automaticamente

### Uso em Produção (Cozinha)
1. Acesse "Movimentações"
2. Registre uma SAÍDA
3. Informe o motivo (ex: "Consumo interno")
4. O estoque é atualizado automaticamente

### Perda de Produto
1. Acesse "Movimentações"
2. Registre uma SAÍDA
3. Informe o motivo (ex: "Perda - vencido")
4. O estoque é atualizado automaticamente

### Inventário
1. Acesse "Produtos"
2. Verifique a quantidade atual de cada produto
3. Se necessário, ajuste via movimentação
4. Compare com o estoque físico

## 🔄 Atualizações

Para atualizar o sistema:

```bash
# Backend
cd backend
git pull
npm install
npm run build
npm run start:prod

# Frontend
cd frontend
git pull
npm install
npm run build
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação
2. Verifique os logs do backend e frontend
3. Abra uma issue no repositório