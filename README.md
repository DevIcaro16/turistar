# 🚀 App Passeios Turísticos

Sistema completo para gestão de passeios turísticos, incluindo backend, frontend web, aplicativo mobile e testes automatizados.

## 📋 Visão Geral

Este projeto é uma solução full-stack para gerenciamento de passeios turísticos, composta por múltiplos aplicativos:

- **Backend API**: API RESTful para autenticação, reservas, pagamentos, etc.
- **Frontend Web**: Painel administrativo e interface web para usuários.
- **Mobile App**: Aplicativo React Native/Expo para motoristas e turistas.
- **Testes Automatizados**: Testes unitários e E2E.

## 🏕️ Estrutura do Projeto

```
app_passeios_turisticos/
├── apps/
│   ├── backend-api/        # API REST (Node.js/Express)
│   ├── backend-api-e2e/    # Testes E2E backend
│   ├── frontend/           # Frontend web (Next.js + Tailwind CSS)
│   ├── frontend-e2e/       # Testes E2E frontend
│   └── mobile/             # App Mobile (React Native/Expo)
├── packages/               # Bibliotecas compartilhadas
├── prisma/                 # Schema do banco de dados
└── tools/                  # Scripts e ferramentas
```

## 🚀 Tecnologias Principais
- **Node.js**, **Express** (API backend)
- **React Native**, **Expo** (App mobile)
- **Next.js** (Frontend web)
- **Tailwind CSS** (estilização frontend)
- **TypeScript** (tipagem)
- **JWT** (autenticação)
- **Prisma** (ORM)
- **MongoDB** (banco de dados principal)
- **Redis** (cache e sessões)
- **Jest** (testes)
- **Docker** (containerização)

## 📦 Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone <repo-url>
   cd app_passeios_turisticos
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure o banco de dados:**
   - Edite o arquivo `.env` com as credenciais do MongoDB e Redis.
   - Execute as migrações (se necessário):
     ```bash
     npx prisma migrate dev
     ```
4. **Comandos principais:**
   - Iniciar backend: `npm run api`
   - Iniciar frontend: `npm run frontend`
   - Iniciar mobile: `npm run mobile`
   - Rodar todos os testes: `npm run test:all`

## 📚 Documentação
- **Swagger API**: `/api-docs` (quando backend estiver rodando)
- **Mais detalhes**: Veja o README.md de cada app em `apps/<app>/README.md` para instruções e detalhes específicos.

---

Desenvolvido com ❤️ pela equipe Passeios Turísticos.
