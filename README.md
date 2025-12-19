# PFood Stock - Sistema de Controle de Estoque para Restaurante

Sistema completo de controle de estoque para restaurantes com backend em NestJS e frontend em ReactJS + Vite.

## 🚀 Tecnologias

### Backend
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT (Passport.js)
- Bcrypt
- Swagger

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router DOM
- Axios
- React Hook Form + Zod
- Recharts
- React Hot Toast
- Lucide React

## 📋 Funcionalidades

- ✅ **Autenticação JWT** com roles (ADMIN, MANAGER, OPERATOR)
- ✅ **Gestão de Usuários** (apenas ADMIN)
- ✅ **Gestão de Categorias** (CRUD completo)
- ✅ **Gestão de Produtos** (CRUD completo com filtros)
- ✅ **Controle de Movimentações** (Entradas e Saídas)
- ✅ **Sistema de Alertas** (produtos com estoque baixo)
- ✅ **Dashboard Analítico** (estatísticas e gráficos)
- ✅ **Proteção de Rotas** (frontend e backend)
- ✅ **Documentação Swagger** (API)

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- PostgreSQL 15+
- npm ou yarn

### Opção 1: Instalação Manual

#### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=pfood_stock

JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRES_IN=7d

NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

4. Crie o banco de dados PostgreSQL:
```bash
createdb pfood_stock
```

5. Inicie o servidor:
```bash
npm run start:dev
```

O backend estará rodando em `http://localhost:3000`
A documentação Swagger estará disponível em `http://localhost:3000/api`

#### Frontend

1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
VITE_API_URL=http://localhost:3000
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### Opção 2: Docker Compose

1. Na raiz do projeto, execute:
```bash
docker-compose up -d
```

Isso irá iniciar:
- PostgreSQL na porta 5432
- Backend na porta 3000
- Frontend na porta 5173

## 👤 Usuário Padrão

Para criar o primeiro usuário administrador, faça uma requisição POST para:

```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "Admin",
  "email": "admin@pfood.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

Ou use o Swagger em `http://localhost:3000/api`

## 📚 Estrutura do Projeto

```
pfood-stock/
├── backend/
│   ├── src/
│   │   ├── auth/              # Módulo de autenticação
│   │   ├── users/             # Módulo de usuários
│   │   ├── categories/        # Módulo de categorias
│   │   ├── products/          # Módulo de produtos
│   │   ├── movements/         # Módulo de movimentações
│   │   ├── alerts/            # Módulo de alertas
│   │   ├── dashboard/         # Módulo de dashboard
│   │   ├── common/            # Guards e decorators
│   │   ├── config/            # Configurações
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── services/          # Serviços (API)
│   │   ├── store/             # Zustand stores
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
└── README.md
```

## 🔐 Roles e Permissões

### ADMIN
- Acesso total ao sistema
- Gerenciar usuários
- Gerenciar categorias, produtos e movimentações
- Visualizar dashboard e alertas

### MANAGER
- Gerenciar categorias, produtos e movimentações
- Visualizar dashboard e alertas
- Visualizar usuários (sem editar)

### OPERATOR
- Visualizar produtos e categorias
- Registrar movimentações
- Visualizar dashboard e alertas

## 📊 Endpoints da API

### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login

### Usuários (ADMIN)
- `GET /users` - Listar usuários
- `GET /users/:id` - Buscar usuário
- `POST /users` - Criar usuário
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Remover usuário

### Categorias
- `GET /categories` - Listar categorias
- `GET /categories/:id` - Buscar categoria
- `POST /categories` - Criar categoria (ADMIN/MANAGER)
- `PATCH /categories/:id` - Atualizar categoria (ADMIN/MANAGER)
- `DELETE /categories/:id` - Remover categoria (ADMIN/MANAGER)

### Produtos
- `GET /products` - Listar produtos
- `GET /products/:id` - Buscar produto
- `GET /products/low-stock` - Produtos com estoque baixo
- `POST /products` - Criar produto (ADMIN/MANAGER)
- `PATCH /products/:id` - Atualizar produto (ADMIN/MANAGER)
- `DELETE /products/:id` - Remover produto (ADMIN/MANAGER)

### Movimentações
- `GET /movements` - Listar movimentações
- `GET /movements/:id` - Buscar movimentação
- `POST /movements` - Criar movimentação
- `GET /movements/summary/period` - Resumo por período

### Alertas
- `GET /alerts` - Listar alertas
- `GET /alerts/count` - Contar alertas
- `GET /alerts/critical/count` - Contar alertas críticos

### Dashboard
- `GET /dashboard/stats` - Estatísticas gerais
- `GET /dashboard/movements-chart` - Dados para gráfico de movimentações
- `GET /dashboard/categories-chart` - Dados para gráfico de categorias

## 🧪 Testes

### Backend
```bash
cd backend
npm run test
```

### Frontend
```bash
cd frontend
npm run test
```

## 📦 Build para Produção

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
```

Os arquivos de build estarão em `frontend/dist`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido para controle de estoque de restaurantes.

## 📞 Suporte

Para suporte, abra uma issue no repositório do projeto.