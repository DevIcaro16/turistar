# 📱 Mobile App - Turistar

Aplicativo mobile nativo para motoristas e turistas com funcionalidades completas de reservas, pagamentos e gestão de passeios turísticos.

## ✨ Funcionalidades

### **Para Turistas**
- Cadastro e login de usuários
- Visualização de pacotes turísticos
- Reserva de passeios
- Histórico de reservas
- Carteira digital
- Perfil personalizado
- Notificações

### **Para Motoristas**
- Cadastro e aprovação de motoristas
- Gestão de veículos
- Registro de tours
- Histórico de passeios
- Carteira de ganhos
- Status de disponibilidade
- Notificações de reservas

### **Pagamentos & Transações**
- Integração com Stripe
- Pagamento seguro
- Histórico de transações
- Carteira digital
- Comprovantes automáticos

### **Autenticação & Segurança**
- Login seguro com JWT
- Recuperação de senha
- Verificação de email
- Proteção de rotas
- Logout automático

## 🛠️ Stack Tecnológica

- **Framework**: React Native
- **Plataforma**: Expo SDK
- **Linguagem**: TypeScript
- **Navegação**: React Navigation
- **Estado**: React Context + Hooks
- **Forms**: Formik + Yup
- **HTTP Client**: Axios
- **Pagamentos**: Stripe
- **Notificações**: Expo Notifications
- **Testes**: Jest
- **Build**: EAS Build

## 📱 Arquitetura MVVM

O aplicativo mobile utiliza a arquitetura **Model-View-ViewModel (MVVM)** para garantir uma separação clara de responsabilidades e melhor manutenibilidade do código.

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
│   │   ├── CarModel.ts
│   │   ├── CarViewModel.ts
│   │   ├── index.tsx
│   │   └── styles.tsx
│   ├── TouristPoint/
│   ├── TourPackage/
│   ├── Tours/
│   ├── Wallet/
│   └── Perfil/
└── user/
    ├── Home/
    │   ├── HomeModel.ts
    │   ├── HomeViewModel.ts
    │   ├── index.tsx
    │   └── styles.tsx
    ├── Reservations/
    ├── MyTours/
    ├── TourPackages/
    ├── Wallet/
    └── Perfil/
```

### **Componentes MVVM**

#### **Model**
- Gerencia dados, validações e lógica de negócio
- Responsável por comunicação com APIs
- Contém interfaces e tipos de dados
- Implementa validações e transformações

#### **ViewModel**
- Controla estado da UI e transformações de dados
- Comunica com Model para obter/atualizar dados
- Gerencia estado reativo da interface
- Implementa lógica de apresentação

#### **View**
- Interface do usuário reativa às mudanças do ViewModel
- Componentes React Native puros
- Estilos e animações
- Interações do usuário

### **Benefícios da Arquitetura MVVM**
- **Separação de responsabilidades** clara
- **Testabilidade** melhorada
- **Reutilização** de código
- **Manutenibilidade** facilitada
- **Escalabilidade** do projeto
- **Independência** entre camadas

## 📁 Estrutura do Projeto

```
src/
├── app/                  # Entry point
│   └── App.tsx          # Componente principal
├── components/          # Componentes reutilizáveis
│   ├── AlertComponent.tsx
│   ├── ModalComponent.tsx
│   └── ...
├── contexts/            # Contextos React
│   └── auth.tsx         # Contexto de autenticação
├── hooks/               # Custom hooks
├── pages/               # Páginas da aplicação (MVVM)
│   ├── driver/          # Páginas do motorista
│   │   ├── Home/        # Dashboard motorista (MVVM)
│   │   ├── Tours/       # Gestão de tours (MVVM)
│   │   ├── Wallet/      # Carteira (MVVM)
│   │   └── ...
│   ├── user/            # Páginas do usuário
│   │   ├── Home/        # Dashboard usuário (MVVM)
│   │   ├── Reservations/ # Reservas (MVVM)
│   │   ├── Wallet/      # Carteira (MVVM)
│   │   └── ...
│   ├── SignIn/          # Login
│   ├── SignUp/          # Cadastro
│   └── ForgotPassword/  # Recuperar senha
├── routes/              # Configuração de rotas
│   ├── auth/            # Rotas de autenticação
│   ├── driver/          # Rotas do motorista
│   └── user/            # Rotas do usuário
├── schemas/             # Schemas de validação
├── util/                # Utilitários
│   ├── api/             # Configuração da API
│   ├── stripe/          # Configuração Stripe
│   └── types/           # Tipos TypeScript
```

## 🚀 Comandos

### **Desenvolvimento**
```bash
# Instalar dependências
npm install

# Iniciar Expo
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar no web
npm run web
```

### **Build & Deploy**
```bash
# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios

# Build para ambos
eas build --platform all

# Deploy para stores
eas submit
```

### **Testes**
```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:coverage
```

## 📱 Telas Principais

### **Autenticação**
- **SignIn** - Login de usuários e motoristas
- **SignUp** - Cadastro de novos usuários
- **ForgotPassword** - Recuperação de senha
- **NewPassword** - Definição de nova senha

### **Usuários (Turistas)**
- **Home** - Dashboard com pacotes disponíveis
- **TourPackages** - Lista de pacotes turísticos
- **Reservations** - Histórico de reservas
- **MyTours** - Tours agendados
- **Wallet** - Carteira digital
- **Perfil** - Configurações da conta

### **Motoristas**
- **Home** - Dashboard com tours ativos
- **Tours** - Gestão de tours
- **TourPackage** - Criação de pacotes
- **TouristPoint** - Gestão de pontos turísticos
- **Car** - Gestão de veículos
- **Wallet** - Carteira de ganhos
- **Perfil** - Configurações da conta

## 🔧 Configuração

### **Variáveis de Ambiente**
```bash
# API
API_URL=http://localhost:8000

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Expo
EXPO_PUBLIC_API_URL=http://localhost:8000
```

### **Configuração do Expo**
- `app.json` - Configuração principal
- `eas.json` - Configuração de builds
- `metro.config.js` - Configuração Metro

### **Configuração do Stripe**
- Integração com Stripe Elements
- Processamento de pagamentos
- Webhooks para confirmação

## 🎨 Design & UX

### **Tema**
- **Cores**: Azul Turistar (#0ea5e9)
- **Tipografia**: Sistema nativo
- **Ícones**: Lucide React Native
- **Componentes**: Customizados

### **Navegação**
- **Tab Navigation** - Navegação principal
- **Stack Navigation** - Navegação entre telas
- **Drawer Navigation** - Menu lateral (se necessário)

### **Componentes Base**
- **AlertComponent** - Alertas e notificações
- **ModalComponent** - Modais interativos
- **DateTimePicker** - Seleção de data/hora
- **CheckoutForm** - Formulário de pagamento

## 🔐 Autenticação

### **Fluxo de Login**
1. Usuário seleciona tipo (turista/motorista)
2. Preenche credenciais
3. API retorna JWT tokens
4. Tokens armazenados no AsyncStorage
5. Redirecionamento para dashboard

### **Contexto de Autenticação**
```tsx
const { user, login, logout, sendForgotPasswordCode } = useContext(AuthContext);
```

### **Proteção de Rotas**
- Verificação automática de tokens
- Redirecionamento para login
- Refresh automático de tokens

## 💳 Integração Stripe

### **Funcionalidades**
- **Checkout** - Processamento de pagamentos
- **Carteira** - Gestão de saldo

### **Configuração**
```tsx
import { StripeProvider } from '@stripe/stripe-react-native';

<StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
  <App />
</StripeProvider>
```

## 📊 Estados e Contextos

### **AuthContext**
- Estado de autenticação
- Funções de login/logout
- Recuperação de senha
- Gestão de tokens

### **Hooks Customizados**
- **useAlert** - Gestão de alertas
- **useMetrics** - Métricas do sistema
- **useDriverMetrics** - Métricas do motorista

## 🐛 Troubleshooting

### **Problemas Comuns**

1. **App não conectando com API:**
   - Verificar API_URL
   - Verificar se backend está rodando
   - Verificar configuração CORS

2. **Build falhando:**
   - Verificar dependências
   - Limpar cache: `expo r -c`
   - Verificar configuração EAS

3. **Stripe não funcionando:**
   - Verificar chaves Stripe
   - Verificar configuração webhooks
   - Verificar modo (test/prod)

4. **Navegação com problemas:**
   - Verificar configuração de rotas
   - Verificar dependências React Navigation
   - Verificar tipos TypeScript

## 📱 Build & Deploy

### **EAS Build**
```bash
# Configurar EAS
eas build:configure

# Build para desenvolvimento
eas build --profile development

# Build para produção
eas build --profile production
```

### **App Stores**
```bash
# Submeter para Google Play
eas submit --platform android

# Submeter para App Store
eas submit --platform ios
```

## 📄 Licença

Desenvolvido por Ícaro Rebouças Pinheiro para Turistar.

---

**Versão**: 1.0.0  
**Última atualização**: Julho 2024 