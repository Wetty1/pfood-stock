# Guia de Deploy - PFood Stock

## 🚀 Deploy em Produção

### Pré-requisitos
- Servidor Linux (Ubuntu 20.04+ recomendado)
- Node.js 18+
- PostgreSQL 15+
- Nginx (para servir frontend)
- PM2 (para gerenciar processo do backend)
- Domínio configurado (opcional)
- Certificado SSL (Let's Encrypt recomendado)

## Backend (NestJS)

### 1. Preparar Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install -y nginx
```

### 2. Configurar PostgreSQL

```bash
# Acessar PostgreSQL
sudo -u postgres psql

# Criar banco e usuário
CREATE DATABASE pfood_stock;
CREATE USER pfood_user WITH ENCRYPTED PASSWORD 'senha_segura_aqui';
GRANT ALL PRIVILEGES ON DATABASE pfood_stock TO pfood_user;
\q
```

### 3. Clonar e Configurar Backend

```bash
# Criar diretório
sudo mkdir -p /var/www/pfood-stock
cd /var/www/pfood-stock

# Clonar repositório
git clone <repository-url> .

# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install --production

# Criar arquivo .env
nano .env
```

Configurar `.env` para produção:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=pfood_user
DB_PASSWORD=senha_segura_aqui
DB_NAME=pfood_stock

JWT_SECRET=gere-uma-chave-super-secreta-aqui-use-openssl-rand-base64-32
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=outra-chave-super-secreta-aqui
JWT_REFRESH_EXPIRES_IN=7d

NODE_ENV=production
PORT=3000
FRONTEND_URL=https://seu-dominio.com
```

```bash
# Build da aplicação
npm run build

# Executar seed (opcional)
npm run seed

# Iniciar com PM2
pm2 start dist/main.js --name pfood-backend

# Configurar PM2 para iniciar no boot
pm2 startup
pm2 save
```

### 4. Configurar Nginx para Backend

```bash
sudo nano /etc/nginx/sites-available/pfood-api
```

```nginx
server {
    listen 80;
    server_name api.seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/pfood-api /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## Frontend (React + Vite)

### 1. Build do Frontend

```bash
# Entrar na pasta do frontend
cd /var/www/pfood-stock/frontend

# Instalar dependências
npm install

# Criar arquivo .env
nano .env
```

Configurar `.env`:
```env
VITE_API_URL=https://api.seu-dominio.com
```

```bash
# Build para produção
npm run build
```

### 2. Configurar Nginx para Frontend

```bash
sudo nano /etc/nginx/sites-available/pfood-frontend
```

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    root /var/www/pfood-stock/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/pfood-frontend /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificados
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
sudo certbot --nginx -d api.seu-dominio.com

# Renovação automática já está configurada
```

## Deploy com Docker

### 1. Instalar Docker

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt install -y docker-compose

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
```

### 2. Configurar docker-compose para Produção

```bash
cd /var/www/pfood-stock
nano docker-compose.prod.yml
```

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: pfood-stock-db
    environment:
      POSTGRES_USER: pfood_user
      POSTGRES_PASSWORD: senha_segura_aqui
      POSTGRES_DB: pfood_stock
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - pfood-network
    restart: always

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: pfood-stock-backend
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: pfood_user
      DB_PASSWORD: senha_segura_aqui
      DB_NAME: pfood_stock
      JWT_SECRET: sua-chave-secreta-aqui
      JWT_EXPIRES_IN: 24h
      NODE_ENV: production
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    networks:
      - pfood-network
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: pfood-stock-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - pfood-network
    restart: always

volumes:
  postgres_data:

networks:
  pfood-network:
    driver: bridge
```

### 3. Criar Dockerfiles de Produção

**backend/Dockerfile.prod**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
```

**frontend/Dockerfile.prod**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**frontend/nginx.conf**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 4. Iniciar com Docker

```bash
# Build e iniciar
docker-compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Parar
docker-compose -f docker-compose.prod.yml down
```

## Monitoramento

### PM2 Monitoring

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs pfood-backend

# Monitorar recursos
pm2 monit

# Reiniciar
pm2 restart pfood-backend
```

### Logs do Sistema

```bash
# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs do PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

## Backup

### Backup do Banco de Dados

```bash
# Criar script de backup
nano /usr/local/bin/backup-pfood.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/pfood-stock"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup do banco
pg_dump -U pfood_user pfood_stock > $BACKUP_DIR/db_$DATE.sql

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete

echo "Backup concluído: $DATE"
```

```bash
# Tornar executável
sudo chmod +x /usr/local/bin/backup-pfood.sh

# Adicionar ao cron (diariamente às 2h)
sudo crontab -e
```

Adicionar linha:
```
0 2 * * * /usr/local/bin/backup-pfood.sh
```

## Segurança

### Firewall

```bash
# Configurar UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Fail2Ban

```bash
# Instalar
sudo apt install -y fail2ban

# Configurar
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
```

```bash
# Reiniciar
sudo systemctl restart fail2ban
```

## Atualizações

### Atualizar Backend

```bash
cd /var/www/pfood-stock/backend
git pull
npm install --production
npm run build
pm2 restart pfood-backend
```

### Atualizar Frontend

```bash
cd /var/www/pfood-stock/frontend
git pull
npm install
npm run build
# Arquivos já estão no lugar certo
```

## Troubleshooting

### Backend não inicia
```bash
# Ver logs
pm2 logs pfood-backend

# Verificar porta
sudo netstat -tulpn | grep 3000

# Verificar conexão com banco
psql -U pfood_user -d pfood_stock -h localhost
```

### Frontend não carrega
```bash
# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx

# Ver logs
sudo tail -f /var/log/nginx/error.log
```

### Banco de dados lento
```bash
# Verificar conexões
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Analisar queries lentas
sudo -u postgres psql pfood_stock -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

## Checklist de Deploy

- [ ] Servidor configurado e atualizado
- [ ] PostgreSQL instalado e configurado
- [ ] Banco de dados criado
- [ ] Backend clonado e configurado
- [ ] Variáveis de ambiente configuradas (produção)
- [ ] Backend buildado e rodando com PM2
- [ ] Frontend buildado
- [ ] Nginx configurado para backend e frontend
- [ ] SSL configurado (Let's Encrypt)
- [ ] Firewall configurado
- [ ] Backup automático configurado
- [ ] Monitoramento configurado
- [ ] Testes de funcionamento realizados
- [ ] Documentação atualizada

## Custos Estimados

### VPS/Cloud
- **DigitalOcean Droplet**: $12-24/mês (2-4GB RAM)
- **AWS EC2**: $15-30/mês (t3.small)
- **Heroku**: $14-28/mês (Hobby/Standard)

### Domínio
- **.com**: $10-15/ano

### SSL
- **Let's Encrypt**: Gratuito

### Total Estimado
- **Mínimo**: ~$15/mês
- **Recomendado**: ~$30/mês