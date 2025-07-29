# 🚌 Turistar - Sistema de Passeios Turísticos

Sistema completo para gestão de passeios turísticos, incluindo backend, frontend web, aplicativo mobile e testes automatizados.

## 📋 Visão Geral

Este projeto é uma solução full-stack para gerenciamento de passeios turísticos, composta por múltiplos aplicativos:

- **Backend API**: API RESTful para autenticação, reservas, pagamentos, gestão de motoristas e turistas
- **Frontend Web**: Painel administrativo e interface web para usuários
- **Mobile App**: Aplicativo React Native/Expo para motoristas e turistas com arquitetura MVVM
- **Testes Automatizados**: Testes unitários e E2E

## 🏗️ Arquitetura

```
app_passeios_turisticos/
├── apps/
│   ├── backend-api/        # API REST (Node.js/Express/TypeScript)
│   ├── backend-api-e2e/    # Testes E2E backend
│   ├── frontend/           # Frontend web (Next.js + Tailwind CSS)
│   ├── frontend-e2e/       # Testes E2E frontend
│   └── mobile/             # App Mobile (React Native/Expo + MVVM)
├── packages/               # Bibliotecas compartilhadas
│   ├── error-handle/       # Tratamento de erros centralizado
│   └── libs/               # Bibliotecas compartilhadas (Prisma, Redis)
├── prisma/                 # Schema do banco de dados
├── scripts/                # Scripts de deploy e automação
└── tools/                  # Scripts e ferramentas
```

## 🛠️ Stack Tecnológica

### **Backend (API)**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para banco de dados
- **JWT** - Autenticação e autorização
- **Nodemailer** - Envio de emails
- **Swagger/OpenAPI** - Documentação da API
- **Jest** - Testes unitários
- **Cypress** - Testes E2E

### **Frontend (Web)**
- **Next.js 13** - Framework React com App Router
- **React** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes UI
- **Formik** - Gerenciamento de formulários
- **Yup** - Validação de schemas
- **Cypress** - Testes E2E

### **Mobile (React Native)**
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação
- **Formik** - Gerenciamento de formulários
- **Yup** - Validação de schemas
- **Stripe** - Integração de pagamentos
- **Arquitetura MVVM** - Model-View-ViewModel para separação de responsabilidades

### **Infraestrutura & DevOps**
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **AWS EC2** - Servidor de produção
- **Nginx** - Servidor web e proxy reverso
- **Let's Encrypt** - Certificação SSL/TLS
- **GitHub Actions** - CI/CD pipeline
- **Nx** - Monorepo build system
- **Cloudinary** - Upload de imagens
- **Shell Script** - Automatização de Rotinas

### **Ferramentas & Bibliotecas**
- **Nodemailer** - Envio de emails SMTP
- **EJS** - Templates de email
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Segurança HTTP
- **Morgan** - Logging de requisições
- **Multer** - Upload de arquivos
- **bcrypt** - Hash de senhas
- **crypto** - Geração de códigos OTP

## 📱 Arquitetura MVVM - Mobile App

O aplicativo mobile utiliza a arquitetura **Model-View-ViewModel (MVVM)** para garantir uma separação clara de responsabilidades:

### **Estrutura MVVM**
```
src/pages/
├── driver/
│   ├── Home/
│   │   ├── HomeModel.ts      # Model - Dados e lógica de negócio
│   │   ├── HomeViewModel.ts  # ViewModel - Estado e lógica de apresentação
│   │   ├── index.tsx         # View - Interface do usuário
│   │   └── styles.tsx        # Estilos específicos
│   ├── Car/
│   ├── TouristPoint/
│   └── ...
└── user/
    ├── Home/
    ├── Reservations/
    └── ...
```

### **Componentes MVVM**
- **Model**: Gerencia dados, validações e lógica de negócio
- **ViewModel**: Controla estado da UI, transformações de dados e comunicação com Model
- **View**: Interface do usuário, reativa às mudanças do ViewModel

### **Benefícios**
- **Separação de responsabilidades** clara
- **Testabilidade** melhorada
- **Reutilização** de código
- **Manutenibilidade** facilitada
- **Escalabilidade** do projeto

## 🚀 Deploy & Produção

### **Ambiente de Produção**
- **Servidor**: AWS EC2 (Amazon Linux 2)
- **Containerização**: Docker + Docker Compose
- **Web Server**: Nginx (proxy reverso e servidor web)
- **SSL/TLS**: Let's Encrypt (certificados gratuitos)
- **CI/CD**: GitHub Actions
- **Banco de Dados**: MongoDB Atlas (cloud)
- **Cache**: Upstash/Redis (cloud)
- **Email**: SMTP Gmail (porta 465/SSL)

### **Portas Utilizadas**
- **Backend API**: 8000
- **Frontend Web**: 3000
- **Nginx**: 80 (HTTP) e 443 (HTTPS)
- **Swagger Docs**: 8000/api-docs

### **Variáveis de Ambiente**
```bash
# Banco de Dados
DATABASE_URL=mongodb+srv://...

# Autenticação
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SERVICE=gmail
SMTP_USER=...
SMTP_PASS=...

# Cloudinary
CLOUDINARY_NAME=...
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...

# Stripe
STRIPE_SECRET_KEY=...

# Redis
REDIS_URL=...
REDIS_HOST=...
REDIS_PORT=...
REDIS_PASS=...

# AWS/EC2
EC2_PUBLIC_IP=...
DOMAIN_NAME=...
FRONTEND_URL=...

# Nginx & SSL
NGINX_CONF_PATH=/etc/nginx/sites-available/turistar
SSL_CERT_PATH=/etc/letsencrypt/live/turistar.com.br
SSL_KEY_PATH=/etc/letsencrypt/live/turistar.com.br/privkey.pem
SSL_CERT_PATH=/etc/letsencrypt/live/turistar.com.br/fullchain.pem
```

## 📦 Instalação e Execução

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Docker (opcional)
- Git

### **Desenvolvimento Local**

1. **Clone o repositório:**
   ```bash
   git clone <repo-url>
   cd app_passeios_turisticos
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas credenciais
   ```

4. **Configure o banco de dados:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Comandos de desenvolvimento:**
   ```bash
   # Backend API
   npm run api
   
   # Frontend Web
   npm run frontend
   
   # Mobile App
   npm run mobile
   
   # Mobile App (limpar cache)
   npm run mobile:clear
   
   # Build Frontend
   npm run frontend:build
   
   # Build Backend
   npm run build
   
   # Gerar documentação API
   npm run api-docs
   
   # Testes E2E
   npm run e2e
   ```

### **Deploy em Produção**

1. **Configurar GitHub Secrets:**
   - Todas as variáveis de ambiente necessárias
   - Credenciais AWS/Docker Hub

2. **Deploy automático:**
   - Push para `main` branch
   - GitHub Actions faz deploy automático para EC2

3. **Deploy manual (se necessário):**
   ```bash
   # Na EC2
   git pull origin main
   docker-compose -f docker-compose.prod.yml down
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 📚 Documentação da API

### **Swagger UI**
- **URL**: `http://localhost:8000/api-docs` (desenvolvimento)
- **URL**: `https://turistarturismo.shop/api-docs` (produção)
- **Documentação**: OpenAPI 3.0
- **Testes**: Interface interativa para testar endpoints

### **Endpoints Principais**
- **Autenticação**: `/api/auth/*`
- **Usuários**: `/api/user/*`
- **Motoristas**: `/api/driver/*`
- **Admin**: `/api/admin/*`
- **Pagamentos**: `/api/stripe/*`
- **Reservas**: `/api/reserve/*`

### **URLs de Acesso**
- **Frontend**: `https://turistarturismo.shop`
- **API**: `https://turistarturismo.shop/api`
- **Swagger**: `https://turistarturismo.shop/api-docs`
- **Admin**: `https://turistarturismo.shop/Login`



## 🔧 Scripts Úteis

### **Desenvolvimento**
```bash
# Teste local completo
./scripts/test-local.sh

# Verificar templates de email
./scripts/verify-template.sh

# Teste SMTP
./scripts/test-smtp-465.sh
```

### **Produção**
```bash
# Deploy local
./scripts/deploy-local.sh

# Verificar logs
docker logs turistar-backend-api --tail 50
docker logs turistar-frontend --tail 50
```

## 🌐 Configuração de Domínio e SSL

### **Hostinger (Registro de Domínio)**
1. **Registro do domínio**: `turistarturismo.shop`
2. **Nameservers**: Configurados para Hostinger
3. **DNS Records**:
   - **A Record**: `@` → IP da EC2
   - **A Record**: `www` → IP da EC2
   - **CNAME**: `api` → `@`

### **Nginx (Servidor Web)**
1. **Proxy Reverso**: Redireciona tráfego para containers
2. **SSL/TLS**: Certificados Let's Encrypt
3. **Configuração**:
   ```nginx
   server {
       listen 80;
       server_name turistarturismo.shop www.turistarturismo.shop;
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl;
       server_name turistarturismo.shop www.turistarturismo.shop;
       
       ssl_certificate /etc/letsencrypt/live/turistarturismo.shop/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/turistarturismo.shop/privkey.pem;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api/ {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### **Let's Encrypt (SSL/TLS)**
1. **Certificados gratuitos** e renovação automática
2. **Instalação**: `certbot --nginx -d turistarturismo.shop -d www.turistarturismo.shop`
3. **Renovação automática**: Cron job configurado
4. **Segurança**: HTTPS forçado (HTTP → HTTPS)

## 🐛 Troubleshooting

1. **Email não enviando na EC2:**
   - Verificar Security Group (porta 465)
   - Verificar credenciais SMTP
   - Usar App Password (Gmail)

2. **Templates não encontrados:**
   - Verificar se templates estão no container
   - Executar `./scripts/verify-template.sh`

3. **CORS errors:**
   - Verificar configuração CORS no backend
   - Verificar URLs permitidas

4. **Banco de dados:**
   - Verificar conexão MongoDB Atlas
   - Verificar variáveis de ambiente

5. **Nginx não funcionando:**
   - Verificar se Nginx está rodando: `sudo systemctl status nginx`
   - Verificar configuração: `sudo nginx -t`
   - Verificar logs: `sudo tail -f /var/log/nginx/error.log`

6. **SSL/HTTPS não funcionando:**
   - Verificar certificados: `sudo certbot certificates`
   - Renovar certificados: `sudo certbot renew`
   - Verificar portas 80/443 no Security Group

7. **Domínio não resolvendo:**
   - Verificar DNS no Hostinger
   - Verificar propagação DNS: `nslookup turistarturismo.shop`
   - Aguardar propagação (pode levar até 24h)

## 📄 Licença

Este projeto é privado e desenvolvido para a Turistar.

## 👥 Equipe

Desenvolvido por Ícaro Rebouças Pinheiro.

---

**Versão**: 1.0.0  
**Última atualização**: Julho 2025
