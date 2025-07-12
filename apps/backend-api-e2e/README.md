# Backend API E2E Tests

Este diretório contém os testes end-to-end (E2E) para a API backend.

## 📁 Estrutura dos Testes

```
src/backend-api/
├── main.spec.ts          # Testes da API principal
├── user/
│   └── auth.spec.ts      # Testes de autenticação de usuários
├── driver/
│   └── auth.spec.ts      # Testes de autenticação de motoristas
└── car/                  # Futuros testes de carros
    └── booking.spec.ts   # Testes de reservas
```

## 🚀 Como Executar

### 1. Iniciar o servidor
```bash
npm run api
```

### 2. Executar todos os testes E2E
```bash
npx nx e2e backend-api-e2e
```

### 3. Executar testes específicos
```bash
# Apenas testes de usuário
npx jest --testPathPattern=user

# Apenas testes de motorista
npx jest --testPathPattern=driver
```

## 📋 Tipos de Testes

### **Testes de Usuário** (`user/auth.spec.ts`)
- ✅ Registro de usuário
- ✅ Login de usuário
- ✅ Reset de senha
- ✅ Esqueci minha senha
- ❌ Validações de campos obrigatórios
- ❌ Validações de formato de email

### **Testes de Motorista** (`driver/auth.spec.ts`)
- ✅ Registro de motorista
- ✅ Validação de tipos de transporte
- ✅ Validações de campos obrigatórios
- ❌ Login de motorista (quando implementado)

### **Testes da API Principal** (`main.spec.ts`)
- ✅ Health check
- ✅ Documentação Swagger
- ✅ Headers CORS

## 🔧 Configuração

### Arquivo de Setup (`support/test-setup.ts`)
- Configuração global do axios
- Utilitários para geração de dados de teste
- Setup e teardown automáticos

### Variáveis de Ambiente
```bash
# URL base da API (padrão: http://localhost:8000)
BASE_URL=http://localhost:8000

# Timeout dos testes (padrão: 10000ms)
TEST_TIMEOUT=10000
```

## 📝 Adicionando Novos Testes

### 1. Criar arquivo de teste
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

### 2. Importar no arquivo principal
```typescript
// apps/backend-api-e2e/src/backend-api/backend-api.spec.ts
import './novo-controller/novo.spec';
```

## 🐛 Debugging

### Logs Detalhados
```bash
npx nx e2e backend-api-e2e --verbose
```

### Teste Individual
```bash
npx jest --testNamePattern="should register a new user"
```

## 📊 Cobertura de Testes

Os testes E2E cobrem:
- ✅ Todos os endpoints de autenticação
- ✅ Validações de entrada
- ✅ Respostas de erro
- ✅ Headers HTTP
- ✅ Documentação da API

## ⚠️ Importante

- **Servidor deve estar rodando** antes de executar os testes
- **Banco de dados** deve estar configurado
- **Variáveis de ambiente** devem estar definidas
- **Testes são independentes** mas podem afetar dados do banco 