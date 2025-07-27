#!/bin/bash

echo "🧪 Teste SMTP Porta 465 (como Python)"

# Verificar se estamos na EC2
if ! curl -s http://169.254.169.254/latest/meta-data/instance-id > /dev/null 2>&1; then
    echo "❌ Execute este script na EC2"
    exit 1
fi

echo "✅ Executando na EC2"

# Configuração baseada no Python que funcionou
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=465
export SMTP_USER=suporte.turistarturismo@gmail.com
export SMTP_PASS=xqlq pvfr ysjd verd

echo "📧 Configuração SMTP:"
echo "Host: $SMTP_HOST"
echo "Port: $SMTP_PORT"
echo "User: $SMTP_USER"

# Teste de conectividade
echo "🔍 Testando conectividade porta 465..."
timeout 5 telnet $SMTP_HOST 465 2>/dev/null && echo "✅ Porta 465 acessível" || echo "❌ Porta 465 bloqueada"

# Teste Node.js com configuração igual ao Python
echo "🧪 Teste Node.js (porta 465 + SSL)..."
cat > test-smtp-465.js << 'EOF'
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // SSL como Python
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

console.log('🔧 Configuração:');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('Secure:', true);

transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Erro:', error.message);
        console.log('Código:', error.code);
        process.exit(1);
    } else {
        console.log('✅ Conexão SMTP OK!');
        
        // Tentar enviar email
        const mailOptions = {
            from: `"Teste 465" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: 'Teste SMTP 465 - Node.js',
            text: 'Teste de email via Node.js na porta 465'
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('❌ Erro ao enviar:', error.message);
                process.exit(1);
            } else {
                console.log('✅ Email enviado:', info.messageId);
                process.exit(0);
            }
        });
    }
});
EOF

node test-smtp-465.js
rm -f test-smtp-465.js

echo ""
echo "🎯 Se funcionou, o problema estava na porta!"
echo "💡 Agora a aplicação deve funcionar com porta 465 + SSL" 