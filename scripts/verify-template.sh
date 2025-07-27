#!/bin/bash

echo "🔍 Verificando template no container..."

echo "📁 Verificando se o template existe:"
docker exec turistar-backend-api ls -la /app/src/utils/email-templates/forgot-password-user-email.ejs 2>/dev/null && echo "✅ Template encontrado!" || echo "❌ Template não encontrado"

echo ""
echo "📁 Conteúdo do diretório de templates:"
docker exec turistar-backend-api ls -la /app/src/utils/email-templates/ 2>/dev/null || echo "❌ Diretório não existe"

echo ""
echo "📁 Estrutura do container:"
docker exec turistar-backend-api find /app -name "*.ejs" 2>/dev/null || echo "❌ Nenhum arquivo .ejs encontrado"

echo ""
echo "💡 Se o template não estiver no container:"
echo "1. Faça commit das mudanças: git add . && git commit -m 'fix: corrige caminho do template'"
echo "2. Push: git push"
echo "3. Aguarde o redeploy automático" 