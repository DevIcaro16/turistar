# Frontend - Sistema de Autenticação

## Visão Geral

Este frontend implementa um sistema completo de autenticação com as seguintes funcionalidades:

- **Página de Login** (`/Login`) - Para usuários já cadastrados
- **Página de Cadastro** (`/SignUp`) - Para novos usuários
- **Dashboard Protegido** (`/`) - Acesso apenas para usuários autenticados
- **Redirecionamento Automático** - Baseado no estado de autenticação

## Como Funciona

### 1. Contexto de Autenticação (`AuthContext`)
- Gerencia o estado global de autenticação
- Armazena informações do usuário
- Fornece funções de login/logout
- Persiste dados no localStorage
- Integra com API backend real

### 2. Sistema de Alertas (`AlertProvider`)
- Gerencia alertas globais da aplicação
- Suporta tipos: success, error, warning, info
- Auto-close configurável
- Animações suaves

### 3. Componentes de Proteção de Rota
- **`ProtectedRoute`** - Protege rotas que requerem autenticação
- **`PublicRoute`** - Redireciona usuários já autenticados

### 4. Fluxo de Autenticação
1. Usuário acessa a aplicação
2. Se não estiver autenticado → redirecionado para `/Login`
3. Após login bem-sucedido → redirecionado para `/` (Dashboard)
4. Se tentar acessar `/Login` estando autenticado → redirecionado para `/`

## Estrutura de Arquivos

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação
├── components/
│   ├── ProtectedRoute.tsx       # Proteção de rotas privadas
│   ├── PublicRoute.tsx          # Proteção de rotas públicas
│   ├── Header.tsx               # Header com informações do usuário
│   ├── AlertComponent.tsx       # Componente de alerta
│   └── AlertProvider.tsx        # Provider global de alertas
├── hooks/
│   └── useAlert.ts              # Hook para gerenciar alertas
├── app/
│   ├── layout.tsx               # Layout principal com providers
│   ├── page.tsx                 # Dashboard (rota protegida)
│   ├── Login/
│   │   └── page.tsx             # Página de login
│   └── SignUp/
│       └── page.tsx             # Página de cadastro
├── util/
│   └── api/
│       └── api.ts               # Configuração do axios
└── middleware.ts                # Middleware para controle de rotas
```

## Como Testar

1. **Acesso Inicial**: Acesse a aplicação → será redirecionado para `/Login`
2. **Login**: Use qualquer email e senha válidos → será redirecionado para o Dashboard
3. **Cadastro**: Acesse `/SignUp` → preencha os dados → será redirecionado para o Dashboard
4. **Logout**: Clique no botão "Sair" no header → será redirecionado para `/Login`

## Como Usar o Sistema de Alertas

```typescript
import { useAlertContext } from '../components/AlertProvider';

const MyComponent = () => {
    const { showAlert, showSuccess, showError, showWarning, showInfo } = useAlertContext();

    const handleSuccess = () => {
        showSuccess('Sucesso!', 'Operação realizada com sucesso.');
    };

    const handleError = () => {
        showError('Erro!', 'Algo deu errado.');
    };

    const handleWarning = () => {
        showWarning('Atenção!', 'Esta ação pode ter consequências.');
    };

    const handleInfo = () => {
        showInfo('Informação', 'Aqui está uma informação importante.');
    };

    const handleCustom = () => {
        showAlert('success', 'Título', 'Mensagem personalizada');
    };

    return (
        <div>
            <button onClick={handleSuccess}>Sucesso</button>
            <button onClick={handleError}>Erro</button>
            <button onClick={handleWarning}>Aviso</button>
            <button onClick={handleInfo}>Info</button>
            <button onClick={handleCustom}>Custom</button>
        </div>
    );
};
```

## Próximos Passos

Para integrar com o backend real:

1. ✅ **Função `login` integrada** com API backend real
2. **Implementar refresh token** para manter a sessão ativa
3. **Adicionar validação de token** no middleware
4. **Implementar recuperação de senha**
5. **Adicionar autenticação social** (Google, Facebook, etc.)

## Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **React Context** - Gerenciamento de estado
- **localStorage** - Persistência de dados 