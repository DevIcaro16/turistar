# 🚌 Backend API - Turistar

API RESTful para gerenciamento de passeios turísticos com autenticação, reservas, pagamentos e gestão completa.

## ✨ Funcionalidades

### **Autenticação & Autorização**
- JWT com access/refresh tokens
- Autenticação para usuários, motoristas e admin
- Middleware de autorização por roles
- Recuperação de senha com OTP

### **Gestão de Dados**
- Usuários e motoristas
- Pacotes turísticos
- Pontos turísticos
- Veículos e carros
- Reservas e transações
- Métricas e relatórios

### **Integrações**
- **Stripe** - Processamento de pagamentos
- **Cloudinary** - Upload de imagens
- **Nodemailer** - Envio de emails
- **Redis** - Cache e sessões

## 🛠️ Stack Tecnológica

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Linguagem**: TypeScript
- **ORM**: Prisma
- **Banco**: MongoDB Atlas
- **Cache**: Upstash/Redis
- **Autenticação**: JWT
- **Email**: Nodemailer + EJS templates
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest + Cypress
- **Containerização**: Docker

## 📁 Estrutura do Projeto

```
src/
├── controllers/          # Controladores por módulo
│   ├── admin/           # Admin controllers
│   ├── driver/          # Driver controllers
│   ├── user/            # User controllers
│   ├── stripe/          # Payment controllers
│   └── ...
├── routes/              # Rotas da API
├── services/            # Lógica de negócio
├── utils/               # Utilitários
│   ├── auth/            # Middleware de autenticação
│   ├── sendEmail/       # Envio de emails
│   └── ...
├── main.ts              # Entry point
└── swagger.js           # Configuração Swagger
```

## 🚀 Comandos

### **Desenvolvimento**
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build do projeto
npm run build

# Executar em produção
npm start
```

### **Banco de Dados**
```bash
# Gerar Prisma Client
npx prisma generate

# Sincronizar schema
npx prisma db push

# Abrir Prisma Studio
npx prisma studio
```

### **Testes**
```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Cobertura
npm run test:coverage
```

## 📚 Documentação da API

### **Swagger UI**
- **URL**: `http://localhost:8000/api-docs`
- **Documentação**: OpenAPI 3.0
- **Testes**: Interface interativa

### **Endpoints Principais**

#### **Autenticação**
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/forgot-password` - Recuperar senha
- `POST /api/auth/verify-otp` - Verificar OTP

#### **Usuários**
- `GET /api/user/profile` - Perfil do usuário
- `PUT /api/user/profile` - Atualizar perfil
- `GET /api/user/reservations` - Reservas do usuário

#### **Motoristas**
- `POST /api/driver/login` - Login de motorista
- `GET /api/driver/tours` - Tours do motorista
- `POST /api/driver/register-tour` - Registrar tour

#### **Admin**
- `GET /api/admin/metrics` - Métricas do sistema
- `GET /api/admin/users` - Listar usuários
- `GET /api/admin/drivers` - Listar motoristas

#### **Pagamentos**
- `POST /api/stripe/create-payment` - Criar pagamento
- `POST /api/stripe/webhook` - Webhook Stripe

## 🔧 Variáveis de Ambiente

```bash
# Servidor
PORT=8000
HOST=0.0.0.0
NODE_ENV=development

# Banco de Dados
DATABASE_URL=mongodb+srv://...

# Autenticação
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
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
```

## 🐛 Troubleshooting

### **Problemas Comuns**

1. **Email não enviando:**
   - Verificar credenciais SMTP
   - Verificar porta 465/SSL
   - Usar App Password (Gmail)

2. **Templates não encontrados:**
   - Verificar se templates estão no container
   - Executar `./scripts/verify-template.sh`

3. **Conexão com banco:**
   - Verificar DATABASE_URL
   - Executar `npx prisma generate`

4. **CORS errors:**
   - Verificar configuração CORS
   - Verificar URLs permitidas

## 📄 Licença

Desenvolvido por Ícaro Rebouças Pinheiro para Turistar.

---

**Versão**: 1.0.0  
**Última atualização**: Julho 2024 