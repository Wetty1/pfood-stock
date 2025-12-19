# Migrations - PFood Stock

## 📋 Migrations Criadas

### 1. CreateUsersTable (1704067200000)
Cria a tabela `users` com:
- id (serial, primary key)
- name (varchar)
- email (varchar, unique)
- password (varchar)
- role (enum: ADMIN, MANAGER, OPERATOR)
- isActive (boolean, default: true)
- createdAt, updatedAt (timestamps)

### 2. CreateCategoriesTable (1704067300000)
Cria a tabela `categories` com:
- id (serial, primary key)
- name (varchar)
- description (text, nullable)
- createdAt, updatedAt (timestamps)

### 3. CreateProductsTable (1704067400000)
Cria a tabela `products` com:
- id (serial, primary key)
- name (varchar)
- categoryId (integer, foreign key)
- unit (varchar)
- currentQuantity (decimal 10,2)
- minQuantity (decimal 10,2)
- unitPrice (decimal 10,2, nullable)
- sku (varchar, nullable)
- expirationDate (date, nullable)
- createdAt, updatedAt (timestamps)
- Foreign key: categoryId → categories.id
- Index: categoryId

### 4. CreateMovementsTable (1704067500000)
Cria a tabela `movements` com:
- id (serial, primary key)
- productId (integer, foreign key)
- userId (integer, foreign key)
- type (enum: ENTRY, EXIT)
- quantity (decimal 10,2)
- reason (varchar, nullable)
- supplier (varchar, nullable)
- invoiceNumber (varchar, nullable)
- notes (text, nullable)
- createdAt (timestamp)
- Foreign keys: productId → products.id, userId → users.id
- Indexes: productId, userId, type, createdAt

## 🚀 Como Executar

### Executar Migrations
```bash
cd backend
npm run migration:run
```

### Ver Status das Migrations
```bash
npm run migration:show
```

### Reverter Última Migration
```bash
npm run migration:revert
```

### Gerar Nova Migration
```bash
npm run migration:generate -- src/migrations/NomeDaMigration
```

## 🔧 Configuração

### Desenvolvimento
- `synchronize: false` - Usa migrations
- `migrationsRun: false` - Executa manualmente

### Produção
- `synchronize: false` - Usa migrations
- `migrationsRun: true` - Executa automaticamente

## 📝 Ordem de Execução

1. **users** - Tabela base para autenticação
2. **categories** - Categorias de produtos
3. **products** - Produtos (depende de categories)
4. **movements** - Movimentações (depende de products e users)

## 🛠️ Comandos Úteis

### Setup Inicial do Banco
```bash
# Criar banco
createdb pfood_stock

# Executar migrations
npm run migration:run

# Popular com dados iniciais
npm run seed
```

### Desenvolvimento
```bash
# Ver migrations pendentes
npm run migration:show

# Executar migrations pendentes
npm run migration:run

# Reverter última migration
npm run migration:revert
```

## ⚠️ Importante

- **Nunca** altere migrations já executadas em produção
- **Sempre** crie novas migrations para mudanças
- **Teste** migrations em ambiente de desenvolvimento primeiro
- **Faça backup** antes de executar em produção

## 🔍 Troubleshooting

### Migration já executada
```
Error: Migration "CreateUsersTable1704067200000" has already been executed
```
**Solução**: Migration já foi executada, use `npm run migration:show` para verificar

### Erro de conexão
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solução**: Verifique se PostgreSQL está rodando e configurações do .env

### Tabela já existe
```
Error: relation "users" already exists
```
**Solução**: Tabela já existe, pode ter sido criada com synchronize:true

### Limpar e Recriar (Desenvolvimento)
```bash
# Dropar todas as tabelas
psql -d pfood_stock -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Executar migrations novamente
npm run migration:run
```