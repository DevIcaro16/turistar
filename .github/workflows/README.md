# GitHub Actions - Deploy Pipeline

Este diretório contém a pipeline de CI/CD para build e deploy automático na EC2.

## 📋 Pré-requisitos

### 1. GitHub Secrets
Configure os seguintes secrets no seu repositório GitHub:

#### Docker Hub Credentials
- `DOCKER_HUB_USERNAME`: Seu username do Docker Hub
- `DOCKER_HUB_PASSWORD`: Sua senha do Docker Hub

#### Database Configuration
- `DATABASE_URL`: URL de conexão com MongoDB
- `MONGO_ROOT_USERNAME`: Username do MongoDB
- `MONGO_ROOT_PASSWORD`: Senha do MongoDB

#### JWT Configuration
- `JWT_SECRET`: Chave secreta para JWT (mínimo 32 caracteres)

#### Cloudinary Configuration
- `CLOUDINARY_CLOUD_NAME`: Nome da cloud do Cloudinary
- `CLOUDINARY_API_KEY`: API Key do Cloudinary
- `CLOUDINARY_API_SECRET`: API Secret do Cloudinary

#### Stripe Configuration
- `STRIPE_SECRET_KEY`: Chave secreta do Stripe

#### EC2/AWS Configuration
- `EC2_PUBLIC_IP`: IP público da sua EC2 (ex: http://18.123.45.67)
- `FRONTEND_URL`: URL do frontend (ex: http://18.123.45.67:3000)
- `DOMAIN_NAME`: Domínio customizado (opcional, ex: https://meusite.com)
- `NEXT_PUBLIC_API_URL`: URL da API para o frontend (ex: http://18.123.45.67:8000/api/)

### 2. GitHub Actions Runner na EC2

Configure um self-hosted runner na sua EC2:

```bash
# Na EC2
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configurar o runner
./config.sh --url https://github.com/SEU_USERNAME/SEU_REPO --token SEU_TOKEN

# Instalar como serviço
sudo ./svc.sh install
sudo ./svc.sh start
```

### 3. Docker na EC2

```bash
# Instalar Docker
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## 🚀 Como funciona

### Job: Build
1. **Checkout**: Baixa o código do repositório
2. **Docker Setup**: Configura Docker Buildx
3. **Login**: Faz login no Docker Hub
4. **Build**: Constrói as imagens Docker
5. **Push**: Envia as imagens para o Docker Hub
6. **Artifacts**: Salva informações do deployment

### Job: Deploy
1. **Checkout**: Baixa o código na EC2
2. **Environment**: Cria arquivo .env com secrets
3. **Docker Compose**: Cria docker-compose.prod.yml
4. **Stop**: Para containers existentes
5. **Pull**: Baixa imagens mais recentes
6. **Deploy**: Inicia os containers
7. **Health Check**: Verifica se os serviços estão funcionando
8. **Cleanup**: Remove imagens antigas

## 📝 Triggers

A pipeline é executada automaticamente quando:

- **Push** para `main` ou `master`
- **Pull Request** para `main` ou `master`
- **Manual** via GitHub Actions UI

## 🔧 Configuração Manual

Para executar manualmente:

1. Vá para **Actions** no GitHub
2. Selecione **Build and Deploy to EC2**
3. Clique em **Run workflow**
4. Escolha o ambiente (production/staging)
5. Clique em **Run workflow**

## 📊 Monitoramento

### Logs
- Acesse **Actions** no GitHub para ver logs detalhados
- Cada job tem logs separados
- Artifacts são salvos por 30 dias

### Health Check
A pipeline verifica automaticamente:
- ✅ Backend API (porta 8000)
- ✅ Frontend (porta 3000)
- ✅ MongoDB (porta 27017)
- ✅ Redis (porta 6379)

### URLs de Acesso
- **Backend**: `http://SEU_IP:8000`
- **Frontend**: `http://SEU_IP:3000`
- **API Docs**: `http://SEU_IP:8000/api-docs`

## 🛠️ Troubleshooting

### Problemas Comuns

1. **Docker não está rodando na EC2**
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

2. **Permissões de Docker**
   ```bash
   sudo usermod -aG docker $USER
   # Faça logout e login novamente
   ```

3. **Portas não acessíveis**
   - Verifique Security Groups da EC2
   - Portas necessárias: 22, 3000, 8000, 27017, 6379

4. **Imagens não encontradas**
   - Verifique se o login no Docker Hub está correto
   - Verifique se as imagens foram pushadas corretamente

### Logs de Debug

```bash
# Na EC2
docker-compose -f docker-compose.prod.yml logs
docker-compose -f docker-compose.prod.yml ps
docker images
```

## 📈 Melhorias Futuras

- [ ] Notificações via Slack/Discord
- [ ] Rollback automático em caso de falha
- [ ] Testes automatizados antes do deploy
- [ ] Monitoramento com Prometheus/Grafana
- [ ] Backup automático do MongoDB
- [ ] SSL/TLS com Let's Encrypt 