# Exemplos de Requisições da API

## Autenticação

### Registrar Usuário
```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@pfood.com",
  "password": "senha123",
  "role": "OPERATOR"
}
```

### Login
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@pfood.com",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Administrador",
    "email": "admin@pfood.com",
    "role": "ADMIN"
  }
}
```

## Categorias

### Listar Categorias
```bash
GET http://localhost:3000/categories
Authorization: Bearer {token}
```

### Criar Categoria
```bash
POST http://localhost:3000/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Carnes",
  "description": "Produtos cárneos em geral"
}
```

### Atualizar Categoria
```bash
PATCH http://localhost:3000/categories/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Carnes e Aves",
  "description": "Produtos cárneos e aves"
}
```

### Deletar Categoria
```bash
DELETE http://localhost:3000/categories/1
Authorization: Bearer {token}
```

## Produtos

### Listar Produtos
```bash
GET http://localhost:3000/products
Authorization: Bearer {token}
```

### Listar Produtos por Categoria
```bash
GET http://localhost:3000/products?categoryId=1
Authorization: Bearer {token}
```

### Buscar Produtos
```bash
GET http://localhost:3000/products?search=frango
Authorization: Bearer {token}
```

### Produtos com Estoque Baixo
```bash
GET http://localhost:3000/products/low-stock
Authorization: Bearer {token}
```

### Criar Produto
```bash
POST http://localhost:3000/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Filé de Frango",
  "categoryId": 1,
  "unit": "kg",
  "currentQuantity": 10.5,
  "minQuantity": 5.0,
  "unitPrice": 18.90,
  "sku": "FRG001"
}
```

### Atualizar Produto
```bash
PATCH http://localhost:3000/products/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentQuantity": 15.0,
  "unitPrice": 19.90
}
```

### Deletar Produto
```bash
DELETE http://localhost:3000/products/1
Authorization: Bearer {token}
```

## Movimentações

### Listar Movimentações
```bash
GET http://localhost:3000/movements
Authorization: Bearer {token}
```

### Filtrar por Produto
```bash
GET http://localhost:3000/movements?productId=1
Authorization: Bearer {token}
```

### Filtrar por Tipo
```bash
GET http://localhost:3000/movements?type=ENTRY
Authorization: Bearer {token}
```

### Filtrar por Período
```bash
GET http://localhost:3000/movements?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {token}
```

### Criar Entrada
```bash
POST http://localhost:3000/movements
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": 1,
  "type": "ENTRY",
  "quantity": 10.0,
  "supplier": "Fornecedor ABC Ltda",
  "invoiceNumber": "NF-12345",
  "notes": "Produto em perfeito estado"
}
```

### Criar Saída
```bash
POST http://localhost:3000/movements
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": 1,
  "type": "EXIT",
  "quantity": 5.0,
  "reason": "Consumo interno - Produção",
  "notes": "Usado no preparo de refeições"
}
```

### Resumo de Movimentações
```bash
GET http://localhost:3000/movements/summary/period?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {token}
```

## Alertas

### Listar Alertas
```bash
GET http://localhost:3000/alerts
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": 1,
    "productId": 1,
    "productName": "Filé de Frango",
    "categoryName": "Carnes",
    "currentQuantity": 3.5,
    "minQuantity": 5.0,
    "unit": "kg",
    "level": "WARNING"
  },
  {
    "id": 2,
    "productId": 2,
    "productName": "Alface",
    "categoryName": "Vegetais",
    "currentQuantity": 0,
    "minQuantity": 10,
    "unit": "unidades",
    "level": "CRITICAL"
  }
]
```

### Contar Alertas
```bash
GET http://localhost:3000/alerts/count
Authorization: Bearer {token}
```

### Contar Alertas Críticos
```bash
GET http://localhost:3000/alerts/critical/count
Authorization: Bearer {token}
```

## Dashboard

### Estatísticas Gerais
```bash
GET http://localhost:3000/dashboard/stats
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "totalProducts": 25,
  "alertsCount": 5,
  "criticalAlertsCount": 2,
  "totalStockValue": 15750.50,
  "last30Days": {
    "totalEntries": 45,
    "totalExits": 38,
    "totalEntriesQuantity": 250.5,
    "totalExitsQuantity": 180.3
  }
}
```

### Gráfico de Movimentações
```bash
GET http://localhost:3000/dashboard/movements-chart?days=7
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "date": "2024-01-15",
    "entries": 5,
    "exits": 3
  },
  {
    "date": "2024-01-16",
    "entries": 8,
    "exits": 6
  }
]
```

### Gráfico de Categorias
```bash
GET http://localhost:3000/dashboard/categories-chart
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "name": "Carnes",
    "count": 8
  },
  {
    "name": "Vegetais",
    "count": 12
  },
  {
    "name": "Laticínios",
    "count": 5
  }
]
```

## Usuários (apenas ADMIN)

### Listar Usuários
```bash
GET http://localhost:3000/users
Authorization: Bearer {token}
```

### Buscar Usuário
```bash
GET http://localhost:3000/users/1
Authorization: Bearer {token}
```

### Criar Usuário
```bash
POST http://localhost:3000/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Maria Santos",
  "email": "maria@pfood.com",
  "password": "senha123",
  "role": "MANAGER",
  "isActive": true
}
```

### Atualizar Usuário
```bash
PATCH http://localhost:3000/users/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Maria Santos Silva",
  "role": "ADMIN"
}
```

### Deletar Usuário
```bash
DELETE http://localhost:3000/users/1
Authorization: Bearer {token}
```

## Códigos de Status HTTP

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **400 Bad Request**: Dados inválidos
- **401 Unauthorized**: Não autenticado
- **403 Forbidden**: Sem permissão
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Conflito (ex: email já existe)
- **500 Internal Server Error**: Erro no servidor

## Testando com cURL

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pfood.com","password":"admin123"}'
```

### Listar Produtos (com token)
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer {seu-token-aqui}"
```

### Criar Categoria
```bash
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer {seu-token-aqui}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bebidas","description":"Bebidas em geral"}'
```

## Testando com Postman

1. Importe a coleção de requisições
2. Configure a variável de ambiente `baseUrl` como `http://localhost:3000`
3. Faça login e copie o `access_token`
4. Configure a variável `token` com o valor copiado
5. Use `{{baseUrl}}` e `{{token}}` nas requisições

## Swagger UI

Acesse `http://localhost:3000/api` para testar todas as rotas de forma interativa:

1. Clique em "Authorize"
2. Cole seu token JWT
3. Teste qualquer endpoint diretamente pela interface