# Arquitetura do Sistema PFood Stock

## Visão Geral

O PFood Stock é um sistema full-stack dividido em duas aplicações principais:
- **Backend**: API RESTful construída com NestJS
- **Frontend**: SPA (Single Page Application) construída com React + Vite

## Backend (NestJS)

### Arquitetura em Camadas

```
┌─────────────────────────────────────┐
│         Controllers                 │  ← Recebe requisições HTTP
├─────────────────────────────────────┤
│         Services                    │  ← Lógica de negócio
├─────────────────────────────────────┤
│         Repositories (TypeORM)      │  ← Acesso aos dados
├─────────────────────────────────────┤
│         Database (PostgreSQL)       │  ← Persistência
└─────────────────────────────────────┘
```

### Módulos

#### 1. Auth Module
- **Responsabilidade**: Autenticação e autorização
- **Componentes**:
  - `AuthService`: Lógica de login, registro e validação
  - `AuthController`: Endpoints de autenticação
  - `JwtStrategy`: Estratégia de validação JWT
  - `LocalStrategy`: Estratégia de autenticação local

#### 2. Users Module
- **Responsabilidade**: Gerenciamento de usuários
- **Componentes**:
  - `UsersService`: CRUD de usuários
  - `UsersController`: Endpoints de usuários
  - `User Entity`: Modelo de dados do usuário

#### 3. Categories Module
- **Responsabilidade**: Gerenciamento de categorias de produtos
- **Componentes**:
  - `CategoriesService`: CRUD de categorias
  - `CategoriesController`: Endpoints de categorias
  - `Category Entity`: Modelo de dados da categoria

#### 4. Products Module
- **Responsabilidade**: Gerenciamento de produtos
- **Componentes**:
  - `ProductsService`: CRUD de produtos + busca e filtros
  - `ProductsController`: Endpoints de produtos
  - `Product Entity`: Modelo de dados do produto

#### 5. Movements Module
- **Responsabilidade**: Controle de movimentações de estoque
- **Componentes**:
  - `MovementsService`: Registro de entradas/saídas + atualização de estoque
  - `MovementsController`: Endpoints de movimentações
  - `Movement Entity`: Modelo de dados da movimentação

#### 6. Alerts Module
- **Responsabilidade**: Sistema de alertas de estoque baixo
- **Componentes**:
  - `AlertsService`: Verificação e listagem de alertas
  - `AlertsController`: Endpoints de alertas

#### 7. Dashboard Module
- **Responsabilidade**: Estatísticas e dados analíticos
- **Componentes**:
  - `DashboardService`: Agregação de dados e cálculos
  - `DashboardController`: Endpoints de dashboard

### Guards e Decorators

#### Guards
- **JwtAuthGuard**: Valida token JWT em rotas protegidas
- **RolesGuard**: Valida permissões baseadas em roles

#### Decorators
- **@Roles()**: Define roles necessárias para acessar um endpoint

### Fluxo de Autenticação

```
1. Cliente envia credenciais → POST /auth/login
2. AuthService valida credenciais
3. Se válido, gera JWT token
4. Cliente armazena token
5. Cliente envia token em requisições → Authorization: Bearer <token>
6. JwtAuthGuard valida token
7. RolesGuard valida permissões
8. Controller processa requisição
```

### Modelo de Dados

```
User (1) ──────→ (N) Movement
                      ↓
Category (1) ──→ (N) Product (1) ──→ (N) Movement
```

## Frontend (React + Vite)

### Arquitetura de Componentes

```
┌─────────────────────────────────────┐
│         Pages                       │  ← Páginas completas
├─────────────────────────────────────┤
│         Components                  │  ← Componentes reutilizáveis
├─────────────────────────────────────┤
│         Hooks                       │  ← Lógica reutilizável
├─────────────────────────────────────┤
│         Services (API)              │  ← Comunicação com backend
├─────────────────────────────────────┤
│         Store (Zustand)             │  ← Estado global
└─────────────────────────────────────┘
```

### Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de UI básicos
│   ├── Layout.tsx      # Layout principal
│   └── ProtectedRoute.tsx
├── pages/              # Páginas da aplicação
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Categories.tsx
│   ├── Products.tsx
│   ├── Movements.tsx
│   ├── Alerts.tsx
│   └── Users.tsx
├── services/           # Serviços de API
│   └── api.ts
├── store/              # Estado global (Zustand)
│   └── authStore.ts
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Funções utilitárias
├── App.tsx             # Componente raiz
└── main.tsx            # Entry point
```

### Gerenciamento de Estado

#### Zustand Store (authStore)
- **Estado**: user, token, isAuthenticated
- **Ações**: login, register, logout, loadUser

### Roteamento

```
/ (Layout)
├── /dashboard          # Dashboard com estatísticas
├── /categories         # Gerenciamento de categorias
├── /products           # Gerenciamento de produtos
├── /movements          # Registro de movimentações
├── /alerts             # Lista de alertas
└── /users              # Gerenciamento de usuários (ADMIN)

/login                  # Página de login (pública)
```

### Fluxo de Autenticação no Frontend

```
1. Usuário acessa aplicação
2. AuthStore verifica localStorage
3. Se token existe, carrega usuário
4. Se não, redireciona para /login
5. Após login, armazena token e user
6. Axios interceptor adiciona token em requisições
7. Se 401, limpa token e redireciona para /login
```

### Comunicação com API

#### Axios Instance
- **Base URL**: Configurável via env (VITE_API_URL)
- **Request Interceptor**: Adiciona token JWT
- **Response Interceptor**: Trata erros 401 (não autorizado)

## Segurança

### Backend
1. **Senhas**: Hash com bcrypt (salt rounds: 10)
2. **JWT**: Tokens assinados com secret key
3. **Validação**: Class-validator em todos os DTOs
4. **Guards**: Proteção de rotas por autenticação e roles
5. **CORS**: Configurado para aceitar apenas frontend

### Frontend
1. **Tokens**: Armazenados em localStorage
2. **Rotas Protegidas**: ProtectedRoute component
3. **Interceptors**: Renovação automática em caso de expiração
4. **Validação**: React Hook Form + Zod

## Performance

### Backend
- **Eager Loading**: Relacionamentos carregados quando necessário
- **Indexação**: IDs e campos únicos indexados
- **Caching**: Possível implementar Redis para cache

### Frontend
- **Code Splitting**: React.lazy para carregamento sob demanda
- **Memoization**: useMemo e useCallback onde necessário
- **Otimização de Bundle**: Vite com tree-shaking automático

## Escalabilidade

### Horizontal
- Backend stateless (JWT)
- Possível adicionar load balancer
- Database replication para leitura

### Vertical
- Otimização de queries
- Índices no banco de dados
- Paginação em listagens grandes

## Monitoramento

### Logs
- NestJS Logger para backend
- Console.error para frontend (produção: serviço externo)

### Métricas
- Tempo de resposta das APIs
- Taxa de erro
- Uso de recursos

## Deploy

### Backend
1. Build: `npm run build`
2. Variáveis de ambiente configuradas
3. Migrations executadas
4. PM2 ou Docker para gerenciamento

### Frontend
1. Build: `npm run build`
2. Servir arquivos estáticos (Nginx, Vercel, Netlify)
3. Variáveis de ambiente configuradas

### Database
- PostgreSQL em servidor dedicado
- Backups automáticos
- Replicação para alta disponibilidade