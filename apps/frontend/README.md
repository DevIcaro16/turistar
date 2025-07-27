# 🌐 Frontend Web - Turistar

Interface web moderna para administração e gestão de passeios turísticos com dashboard completo e métricas.

## ✨ Funcionalidades

### **Dashboard Administrativo**
- Métricas e KPIs
- Gráficos e visualizações interativas
- Resumo de reservas e transações
- Status de motoristas e veículos

### **Gestão de Usuários**
- Listagem e busca de usuários
- Perfis detalhados
- Histórico de reservas
- Status de conta

### **Gestão de Motoristas**
- Cadastro e aprovação de motoristas
- Histórico de tours
- Métricas de performance
- Gestão de veículos

### **Transações & Pagamentos**
- Histórico de transações
- Status de pagamentos
- Relatórios financeiros
- Integração com Stripe

### **Autenticação & Segurança**
- Login seguro com JWT
- Middleware de proteção de rotas
- Gestão de sessões
- Logout automático

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 13 (App Router)
- **UI Library**: React 18
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **Forms**: React Hook Form + Yup
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Testes**: Jest + Cypress
- **Containerização**: Docker

## 📁 Estrutura do Projeto

```
src/
├── app/                  # App Router (Next.js 13)
│   ├── Account/         # Página de conta
│   ├── Configurations/  # Configurações
│   ├── Drivers/         # Gestão de motoristas
│   ├── Login/           # Página de login
│   ├── Transactions/    # Transações
│   ├── Users/           # Gestão de usuários
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página inicial
├── components/          # Componentes reutilizáveis
│   ├── charts/          # Componentes de gráficos
│   ├── ui/              # Componentes base (Shadcn/ui)
│   └── ...
├── hooks/               # Custom hooks
├── lib/                 # Utilitários e configurações
├── schemas/             # Schemas de validação (Yup)
└── util/                # Utilitários gerais
```

## 🚀 Comandos

### **Desenvolvimento**
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Executar em produção
npm start
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

### **Linting & Formatação**
```bash
# Lint
npm run lint

# Format
npm run format
```

## 📱 Páginas Principais

### **Dashboard**
- `/` - Página inicial com métricas
- `/Account` - Perfil do usuário
- `/Configurations` - Configurações do sistema

### **Gestão**
- `/Users` - Listagem e gestão de usuários
- `/Drivers` - Listagem e gestão de motoristas
- `/Transactions` - Histórico de transações

### **Autenticação**
- `/Login` - Página de login
- Middleware de proteção automática

## 🔧 Configuração

### **Variáveis de Ambiente**
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Ambiente
NODE_ENV=development
```

### **Configuração do Tailwind**
- `tailwind.config.js` - Configuração principal
- `postcss.config.js` - Configuração PostCSS
- Classes utilitárias personalizadas

### **Componentes UI**
- Baseados em Shadcn/ui
- Tema personalizado
- Componentes acessíveis

## 📊 Componentes de Gráficos

### **Charts Disponíveis**
- **PackagesChart** - Gráfico de pacotes
- **PackagesCompleted** - Pacotes completados
- **PackagesPizzaChart** - Gráfico pizza de pacotes
- **ReservationsChart** - Gráfico de reservas

### **Uso**
```tsx
import { PackagesChart } from '@/components/charts/PackagesChart';

<PackagesChart data={packagesData} />
```

## 🎨 Design System

### **Cores**
- **Primary**: Azul Turistar (#0ea5e9)
- **Secondary**: Azul escuro (#3b82f6)
- **Accent**: Amarelo (#fbbf24)
- **Background**: Branco (#ffffff)
- **Text**: Cinza escuro (#1e293b)

### **Componentes Base**
- **Button** - Botões com variantes
- **Card** - Cards informativos
- **Input** - Campos de entrada
- **Label** - Labels de formulário
- **Modal** - Modais interativos
- **Table** - Tabelas de dados

## 🔐 Autenticação

### **Fluxo de Login**
1. Usuário acessa `/Login`
2. Preenche credenciais
3. API retorna JWT tokens
4. Tokens armazenados em cookies
5. Redirecionamento para dashboard

### **Proteção de Rotas**
- Middleware automático
- Verificação de tokens
- Redirecionamento para login
- Refresh automático de tokens

## 🐛 Troubleshooting

### **Problemas Comuns**

1. **Erro de CORS:**
   - Verificar NEXT_PUBLIC_API_URL
   - Verificar configuração CORS no backend

2. **Build falhando:**
   - Verificar dependências
   - Limpar cache: `npm run clean`

3. **Componentes não carregando:**
   - Verificar imports
   - Verificar configuração do Tailwind

4. **API não conectando:**
   - Verificar se backend está rodando
   - Verificar variáveis de ambiente

## 📄 Licença

Desenvolvido por Ícaro Rebouças Pinheiro para Turistar.

---

**Versão**: 1.0.0  
**Última atualização**: Julho 2024 