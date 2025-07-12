# 🚀 App Passeios Turísticos

Sistema completo de passeios turísticos com API backend, aplicativo mobile e testes automatizados.

## 📋 Visão Geral

Este projeto é uma aplicação full-stack para gerenciamento de passeios turísticos, incluindo:

- **Backend API** - REST API com Node.js/Express
- **Mobile App** - Aplicativo React Native/Expo
- **Database** - PostgreSQL com Prisma ORM
- **Documentação** - Swagger/OpenAPI
- **Testes** - Unitários e E2E com Jest

## 🏗️ Arquitetura

```
app_passeios_turisticos/
├── apps/
│   ├── backend-api/          # API REST (Node.js/Express)
│   ├── backend-api-e2e/      # Testes E2E
│   └── mobile/               # App Mobile (React Native/Expo)
├── packages/
│   ├── libs/                 # Bibliotecas compartilhadas
│   └── error-handle/         # Tratamento de erros
├── prisma/                   # Schema do banco de dados
└── tools/                    # Scripts e ferramentas
```

## 🚀 Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Linguagem tipada
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação da API

### Mobile
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Linguagem tipada
- **Axios** - Cliente HTTP

### Testes
- **Jest** - Framework de testes
- **Supertest** - Testes de API
- **Testing Library** - Testes de componentes

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- PostgreSQL
- Expo CLI (para mobile)

### 1. Clone o repositório
```bash
git clone https://gitlab.com/mobile-developer4490218/JS/app_passeios_turisticos.git
cd app_passeios_turisticos
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
```bash
# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrações
npx prisma migrate dev
```

### 4. Configure as variáveis de ambiente
```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/passeios_turisticos"
ACCESS_TOKEN_SECRET="seu_secret_aqui"
REFRESH_TOKEN_SECRET="seu_refresh_secret_aqui"
```

## 🚀 Como Executar

### Backend API
```bash
# Desenvolvimento
npm run api

# Produção
npm run api:prod
```

### Mobile App
```bash
# Desenvolvimento
npm run mobile

# Build
npm run mobile:build
```

### Testes
```bash
# Testes unitários
npm test

# Testes E2E
npx nx e2e backend-api-e2e

# Todos os testes
npm run test:all
```

## 📚 Documentação da API

### Swagger UI
- **URL**: http://localhost:8000/api-docs
- **JSON**: http://localhost:8000/docs-json

### Endpoints Principais

#### Usuários
- `POST /api/user/registration` - Registro de usuário
- `POST /api/user/login` - Login de usuário
- `POST /api/user/reset-password` - Reset de senha
- `POST /api/user/forgot-password` - Esqueci minha senha

#### Motoristas
- `POST /api/driver/registration` - Registro de motorista
- `POST /api/driver/login` - Login de motorista

## 🧪 Testes

### Estrutura dos Testes E2E

```
apps/backend-api-e2e/src/backend-api/
├── main.spec.ts              # Testes da API principal
├── user/
│   └── auth.spec.ts          # Testes de autenticação de usuários
├── driver/
│   └── auth.spec.ts          # Testes de autenticação de motoristas
└── car/                      # Futuros testes
    └── booking.spec.ts       # Testes de reservas
```

### Executando Testes E2E

#### 1. Iniciar o servidor
```bash
npm run api
```

#### 2. Executar todos os testes E2E
```bash
npx nx e2e backend-api-e2e
```

#### 3. Executar testes específicos
```bash
# Apenas testes de usuário
npx jest --testPathPattern=user

# Apenas testes de motorista
npx jest --testPathPattern=driver

# Teste individual
npx jest --testNamePattern="should register a new user"
```

### Cobertura de Testes E2E

#### **Testes de Usuário** (`user/auth.spec.ts`)
- ✅ Registro de usuário (sucesso/erro)
- ✅ Login de usuário (sucesso/erro)
- ✅ Reset de senha
- ✅ Esqueci minha senha
- ✅ Validações de campos obrigatórios
- ✅ Validações de formato de email

#### **Testes de Motorista** (`driver/auth.spec.ts`)
- ✅ Registro de motorista (sucesso/erro)
- ✅ Validação de tipos de transporte (BUGGY, LANCHA, FOUR_BY_FOUR)
- ✅ Validações de campos obrigatórios
- ✅ Teste de duplicação de email

#### **Testes da API Principal** (`main.spec.ts`)
- ✅ Health check
- ✅ Documentação Swagger
- ✅ Headers CORS

### Adicionando Novos Testes E2E

#### 1. Criar arquivo de teste
```typescript
// apps/backend-api-e2e/src/backend-api/novo-controller/novo.spec.ts
import axios from 'axios';

describe('Novo Controller E2E Tests', () => {
  it('should test new endpoint', async () => {
    const response = await axios.post('/api/novo-endpoint', data);
    expect(response.status).toBe(200);
  });
});
```

#### 2. Importar no arquivo principal
```typescript
// apps/backend-api-e2e/src/backend-api/backend-api.spec.ts
import './novo-controller/novo.spec';
```

## 🏗️ Estrutura do Código

### Backend API
```
apps/backend-api/src/
├── controllers/              # Controllers HTTP
│   ├── user/
│   │   └── auth.controller.ts
│   └── driver/
│       └── auth.controller.ts
├── services/                 # Lógica de negócio
│   ├── user/
│   │   └── auth.service.ts
│   └── driver/
│       └── auth.service.ts
├── routes/                   # Rotas da API
│   ├── user/
│   │   └── router.ts
│   └── driver/
│       └── router.ts
├── utils/                    # Utilitários
├── main.ts                   # Entry point
└── swagger.js               # Configuração Swagger
```

### Mobile App
```
apps/mobile/src/
├── app/
│   └── App.tsx              # Componente principal
├── components/               # Componentes reutilizáveis
├── screens/                  # Telas da aplicação
├── services/                 # Serviços de API
└── utils/                    # Utilitários
```

## 🔧 Configuração de Desenvolvimento

### VS Code Extensions Recomendadas
- TypeScript and JavaScript Language Features
- Prisma
- REST Client
- Jest Runner
- GitLens

### Scripts Úteis
```bash
# Desenvolvimento
npm run dev              # Inicia backend e mobile
npm run api              # Apenas backend
npm run mobile           # Apenas mobile

# Testes
npm test                 # Testes unitários
npm run test:e2e        # Testes E2E
npm run test:all        # Todos os testes

# Build
npm run build           # Build de todos os projetos
npm run build:api      # Build apenas da API
npm run build:mobile   # Build apenas do mobile

# Database
npm run db:migrate     # Executa migrações
npm run db:seed        # Popula banco com dados de teste
npm run db:reset       # Reseta banco de dados
```

## 🐛 Debugging

### Backend
```bash
# Logs detalhados
DEBUG=* npm run api

# Teste individual
npx jest --testNamePattern="should register user"
```

### Mobile
```bash
# Logs do Expo
expo logs

# Debug no dispositivo
expo start --dev-client
```

### Testes E2E
```bash
# Logs detalhados
npx nx e2e backend-api-e2e --verbose

# Teste específico
npx jest --testNamePattern="should register a new user"
```

## 📊 Monitoramento

### Health Checks
- **API**: `GET /` - Retorna status da API
- **Database**: Verificação automática de conexão
- **Swagger**: `GET /api-docs` - Documentação da API

### Logs
- **Backend**: Logs estruturados com Winston
- **Mobile**: Logs do Expo DevTools
- **Testes**: Relatórios detalhados do Jest

## 🚀 Deploy

### Backend
```bash
# Build para produção
npm run build:api

# Deploy (configurar CI/CD)
npm run deploy:api
```

### Mobile
```bash
# Build para produção
npm run build:mobile

# Publicar no Expo
expo publish
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Issues**: [GitLab Issues](https://gitlab.com/mobile-developer4490218/JS/app_passeios_turisticos/-/issues)
- **Documentação**: [Wiki do Projeto](https://gitlab.com/mobile-developer4490218/JS/app_passeios_turisticos/-/wikis)
- **Email**: suporte@passeios-turisticos.com

---

**Desenvolvido com ❤️ pela equipe de desenvolvimento**
