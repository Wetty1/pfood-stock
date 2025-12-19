Prompt: Sistema de Controle de Estoque para Restaurante
📋 Visão Geral do Projeto
Desenvolver um sistema completo de controle de estoque para restaurantes com backend em NestJS e frontend em ReactJS + Vite, permitindo gestão eficiente de produtos, movimentações e alertas automáticos.
🎯 Funcionalidades Principais

1. Gestão de Categorias

Criar, listar, editar e excluir categorias de produtos
Exemplos: Carnes, Vegetais, Laticínios, Bebidas, Temperos, etc.
Campos: nome, descrição, ícone/cor (opcional)

2. Gestão de Produtos

Cadastrar produtos com informações completas:

Nome do produto
Categoria (relacionamento)
Unidade de medida (kg, litros, unidades, etc.)
Quantidade em estoque atual
Quantidade mínima (para alertas)
Preço de custo (opcional)
Código/SKU (opcional)
Data de validade (opcional)

Listar produtos com filtros (categoria, nome, status de estoque)
Editar e excluir produtos
Visualização detalhada de cada produto

3. Controle de Movimentações
Entradas

Registrar entrada de produtos no estoque
Campos: produto, quantidade, data/hora, fornecedor (opcional), nota fiscal (opcional), observações
Atualizar automaticamente a quantidade em estoque

Saídas

Registrar saída de produtos do estoque
Campos: produto, quantidade, data/hora, motivo (venda, consumo interno, perda, etc.), observações
Atualizar automaticamente a quantidade em estoque
Validar se há quantidade suficiente antes de registrar saída

4. Sistema de Alertas

Alertas automáticos para produtos com estoque abaixo da quantidade mínima
Notificações visuais no dashboard
Lista de produtos em alerta com priorização
Badge/contador de alertas ativos
Possibilidade de definir diferentes níveis de alerta (crítico, atenção)

5. Sistema de Autenticação (OBRIGATÓRIO)
Funcionalidades de Autenticação

Registro de Usuários:

Cadastro com nome, email e senha
Validação de email único
Hash seguro de senha (bcrypt)
Definição de role/perfil

Login:

Autenticação com email e senha
Geração de token JWT
Refresh token para renovação automática
Expiração configurável (ex: 24h)

Controle de Acesso (RBAC):

ADMIN: Acesso total ao sistema
MANAGER: Acesso a todas funcionalidades exceto gestão de usuários
OPERATOR: Acesso limitado (apenas visualizar e registrar movimentações)

Segurança:

Proteção de todas as rotas da API (exceto login/register)
Guards para validação de token
Guards para validação de permissões (roles)
Logout com invalidação de token
Senha forte (mínimo 8 caracteres, letras e números)

Fluxo de Autenticação

Usuário faz login com credenciais
Backend valida e retorna JWT + refresh token
Frontend armazena tokens (localStorage/cookies)
Toda requisição inclui JWT no header (Authorization: Bearer token)
Backend valida token em cada requisição
Ao expirar, refresh token renova automaticamente
Logout limpa tokens e redireciona para login

6. Dashboard Analítico

Visão geral do estoque:

Total de produtos cadastrados
Produtos em alerta
Valor total do estoque (se preço cadastrado)
Produtos mais movimentados

Gráficos de entradas e saídas:

Gráfico de linha temporal (últimos 7, 30, 90 dias)
Gráfico de barras por categoria
Comparativo de entradas vs saídas

Top produtos com maior/menor movimentação
Filtros por período de data

🛠️ Especificações Técnicas
Backend (NestJS)
Estrutura

Arquitetura modular e escalável
Uso de TypeScript
Padrões RESTful para APIs

Módulos Principais

Auth Module (OBRIGATÓRIO)

Sistema de autenticação com JWT
Register e Login
Guards para proteção de rotas
Middleware de autenticação

Users Module

Controller, Service, Entity/DTO
Gestão de usuários do sistema
Perfis/roles (admin, gerente, operador)
Hash de senha com bcrypt

Categories Module

Controller, Service, Entity/DTO
CRUD completo

Products Module

Controller, Service, Entity/DTO
CRUD completo
Relacionamento com Categories

Movements Module

Controller, Service, Entity/DTO
Subtipos: Entries (entradas) e Exits (saídas)
Lógica de atualização automática de estoque
Registro do usuário que fez a movimentação

Alerts Module

Service para verificação de alertas
Endpoint para listar produtos em alerta

Dashboard Module

Endpoints para estatísticas e métricas
Agregações e cálculos

Banco de Dados

PostgreSQL (obrigatório)
TypeORM para ORM
IDs sequenciais numéricos (SERIAL/INTEGER)
Migrations para versionamento do schema
Seeds para dados iniciais (opcional)

Validações

Class-validator para DTOs
Pipes de validação
Tratamento de erros consistente

Recursos Adicionais

Autenticação JWT: Passport.js com estratégia JWT
Autorização: Guards baseados em roles (RBAC)
Segurança: bcrypt para hash de senhas
Documentação com Swagger
Logging estruturado
CORS configurado
Variáveis de ambiente (.env)
Refresh tokens (recomendado)

Frontend (ReactJS + Vite)
Estrutura

Vite para build e desenvolvimento rápido
TypeScript
Arquitetura componentizada

Páginas/Rotas

Login - Autenticação de usuários
Dashboard - Tela inicial com métricas e gráficos (rota protegida)
Categorias - Lista e gerenciamento de categorias (rota protegida)
Produtos - Lista, cadastro e edição de produtos (rota protegida)
Movimentações - Registro e histórico de entradas/saídas (rota protegida)
Alertas - Lista de produtos em alerta (rota protegida)
Usuários - Gerenciamento de usuários (rota protegida - apenas admin)

Bibliotecas Recomendadas

Roteamento: React Router DOM (com rotas protegidas)
Gerenciamento de Estado: Zustand ou Context API (para auth e dados globais)
Requisições HTTP: Axios (com interceptors para JWT)
UI Components:

Tailwind CSS para estilização
Shadcn/ui ou Material-UI para componentes

Gráficos: Recharts ou Chart.js
Formulários: React Hook Form + Zod
Notificações: React Hot Toast ou similar
Ícones: Lucide React
Autenticação:

Armazenamento de token (localStorage ou cookies)
Interceptor Axios para adicionar Bearer token
Refresh token automático

Features de UX

Design responsivo (mobile-first)
Loading states e skeletons
Mensagens de sucesso/erro
Confirmações para ações críticas (exclusões)
Busca e filtros em tempo real
Paginação para listas grandes
Autenticação:

Tela de login intuitiva
Logout com confirmação
Redirecionamento automático ao expirar sessão
Persistência de sessão
Indicador de usuário logado no header
Proteção de rotas baseada em permissões (roles)

📊 Modelos de Dados Sugeridos
User
typescript{
  id: number
  name: string
  email: string (unique)
  password: string (hash)
  role: 'ADMIN' | 'MANAGER' | 'OPERATOR'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
Category
typescript{
  id: number
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}
Product
typescript{
  id: number
  name: string
  categoryId: number
  unit: string
  currentQuantity: number
  minQuantity: number
  unitPrice?: number
  sku?: string
  expirationDate?: Date
  createdAt: Date
  updatedAt: Date
}
Movement
typescript{
  id: number
  productId: number
  userId: number
  type: 'ENTRY' | 'EXIT'
  quantity: number
  reason?: string
  supplier?: string
  invoiceNumber?: string
  notes?: string
  createdAt: Date
}
🎨 Diretrizes de Interface

Layout com sidebar para navegação principal
Header com informações do usuário e contador de alertas
Cards informativos no dashboard
Tabelas responsivas e ordenáveis
Modals para formulários de cadastro/edição
Cores de alerta: vermelho (crítico), amarelo (atenção), verde (OK)
Feedback visual imediato para todas as ações

✅ Requisitos Não-Funcionais

Performance: APIs com resposta < 500ms
Segurança: Validação de dados, proteção contra SQL injection
Usabilidade: Interface intuitiva e acessível
Manutenibilidade: Código limpo, documentado e testável
Escalabilidade: Arquitetura preparada para crescimento

🚀 Entregáveis

Backend NestJS completo com:

APIs documentadas
Testes unitários (opcional mas recomendado)
Docker Compose para ambiente de desenvolvimento

Frontend React + Vite com:

Interface completa e funcional
Design responsivo
Build otimizado para produção

Documentação:

README com instruções de setup
Variáveis de ambiente necessárias
Guia de uso básico

📝 Diferenciais (Opcionais)

Exportação de relatórios (PDF/Excel)
Histórico completo de movimentações por produto
Previsão de reposição baseada em consumo médio
Múltiplos restaurantes/unidades
Integração com fornecedores
App mobile com React Native
Notificações em tempo real (WebSockets)
Upload de fotos de produtos
Código de barras para produtos
