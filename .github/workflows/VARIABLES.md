# Variáveis de Ambiente Necessárias

Configure os seguintes **GitHub Secrets** no seu repositório:

## 🔐 **Docker Hub Credentials**
```
DOCKER_HUB_USERNAME = seu-username-do-docker-hub
DOCKER_HUB_PASSWORD = sua-senha-do-docker-hub
```

## 🗄️ **Database Configuration**
```
DATABASE_URL = mongodb://username:password@localhost:27017/turistar
MONGO_ROOT_USERNAME = admin
MONGO_ROOT_PASSWORD = sua-senha-mongodb
```

## 🔒 **JWT Configuration**
```
ACCESS_TOKEN_SECRET = sua-chave-secreta-access-token-32-caracteres
REFRESH_TOKEN_SECRET = sua-chave-secreta-refresh-token-32-caracteres
```

## ☁️ **Cloudinary Configuration**
```
CLOUDINARY_NAME = seu-cloud-name
CLOUDINARY_KEY = sua-api-key
CLOUDINARY_SECRET = sua-api-secret
```

## 💳 **Stripe Configuration**
```
STRIPE_SECRET_KEY = sk_test_... ou sk_live_...
```

## 🔴 **Redis Configuration**
```
REDIS_URL = redis://localhost:6379 (opcional)
REDIS_HOST = localhost
REDIS_PORT = 6379
REDIS_PASS = sua-senha-redis (opcional)
```

## 📧 **SMTP Configuration**
```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_SERVICE = gmail
SMTP_USER = seu-email@gmail.com
SMTP_PASS = sua-senha-de-app
```

## 🌐 **EC2/AWS Configuration**
```
EC2_PUBLIC_IP = http://18.123.45.67 (substitua pelo IP da sua EC2)
FRONTEND_URL = http://18.123.45.67:3000
DOMAIN_NAME = https://meusite.com (opcional)
NEXT_PUBLIC_API_URL = http://18.123.45.67:8000/api/
```

## 📋 **Lista Completa de Secrets**

| Secret Name | Descrição | Exemplo |
|-------------|-----------|---------|
| `DOCKER_HUB_USERNAME` | Seu username do Docker Hub | `meuusername` |
| `DOCKER_HUB_PASSWORD` | Sua senha do Docker Hub | `minhasenha123` |
| `DATABASE_URL` | URL de conexão MongoDB | `mongodb://admin:senha@localhost:27017/turistar` |
| `MONGO_ROOT_USERNAME` | Username do MongoDB | `admin` |
| `MONGO_ROOT_PASSWORD` | Senha do MongoDB | `senha123` |
| `ACCESS_TOKEN_SECRET` | Chave secreta Access Token | `minha-chave-access-32-caracteres` |
| `REFRESH_TOKEN_SECRET` | Chave secreta Refresh Token | `minha-chave-refresh-32-caracteres` |
| `CLOUDINARY_NAME` | Nome da cloud Cloudinary | `minha-cloud` |
| `CLOUDINARY_KEY` | API Key Cloudinary | `123456789012345` |
| `CLOUDINARY_SECRET` | API Secret Cloudinary | `abc123def456ghi789` |
| `STRIPE_SECRET_KEY` | Chave secreta Stripe | `sk_test_...` |
| `REDIS_URL` | URL do Redis (opcional) | `redis://localhost:6379` |
| `REDIS_HOST` | Host do Redis | `localhost` |
| `REDIS_PORT` | Porta do Redis | `6379` |
| `REDIS_PASS` | Senha do Redis (opcional) | `senha123` |
| `SMTP_HOST` | Host do SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Porta do SMTP | `587` |
| `SMTP_SERVICE` | Serviço SMTP | `gmail` |
| `SMTP_USER` | Email SMTP | `seu-email@gmail.com` |
| `SMTP_PASS` | Senha do email | `senha-de-app` |
| `EC2_PUBLIC_IP` | IP público da EC2 | `http://18.123.45.67` |
| `FRONTEND_URL` | URL do frontend | `http://18.123.45.67:3000` |
| `DOMAIN_NAME` | Domínio customizado | `https://meusite.com` |
| `NEXT_PUBLIC_API_URL` | URL da API | `http://18.123.45.67:8000/api/` |

## 🔧 **Como Configurar**

1. Vá para seu repositório no GitHub
2. Clique em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**
4. Adicione cada variável da lista acima

## ⚠️ **Importante**

- **Senhas fortes**: Use senhas fortes e únicas
- **JWT Secrets**: Mínimo 32 caracteres cada
- **IP da EC2**: Substitua `18.123.45.67` pelo IP real da sua EC2
- **SMTP**: Para Gmail, use "Senha de App" (não a senha normal)
- **Redis**: Se não usar senha, deixe `REDIS_PASS` vazio

## 🚀 **Teste**

Depois de configurar, execute a pipeline manualmente para testar se todas as variáveis estão corretas. 