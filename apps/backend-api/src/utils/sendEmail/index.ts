import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";

dotenv.config()

//SMTP

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // SSL como Python
    // service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false // Para desenvolvimento
    },
    debug: true, // Habilitar logs detalhados
    logger: true // Log de eventos
});


//Renderização do template do email
const renderEmailTemplate = async (templateName: string, data: Record<string, any>): Promise<string> => {

    // Tentar diferentes caminhos para desenvolvimento e produção
    const possiblePaths = [
        path.join(process.cwd(), "src", "utils", "email-templates", `${templateName}.ejs`),
        path.join(process.cwd(), "apps", "backend-api", "src", "utils", "email-templates", `${templateName}.ejs`),
        path.join(__dirname, "..", "email-templates", `${templateName}.ejs`)
    ];

    console.log("🔍 Procurando template em:", possiblePaths);

    for (const templatePath of possiblePaths) {
        try {
            console.log("Tentando caminho:", templatePath);
            const result = await ejs.renderFile(templatePath, data);
            console.log("Template encontrado em:", templatePath);
            return result;
        } catch (error) {
            console.log("Template não encontrado em:", templatePath);
            continue;
        }
    }

    throw new Error(`Template ${templateName}.ejs não encontrado em nenhum dos caminhos: ${possiblePaths.join(", ")}`);
};

//envio do email
export const sendEmail = async (
    to: string,
    subject: string,
    templateName: string,
    data: Record<string, any>
): Promise<boolean> => {
    try {
        console.log("📧 Iniciando envio de email...");
        console.log("Para:", to);
        console.log("Assunto:", subject);
        console.log("Template:", templateName);
        console.log("SMTP Config:", {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 465,
            service: process.env.SMTP_SERVICE,
            user: process.env.SMTP_USER
        });

        const html = await renderEmailTemplate(templateName, data);
        console.log("✅ Template renderizado com sucesso");

        const mailOptions = {
            from: `"Turistar" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        };

        console.log("📤 Enviando email...");
        const result = await transporter.sendMail(mailOptions);
        console.log("✅ Email enviado com sucesso:", result.messageId);
        return true;

    } catch (error: any) {
        console.error("❌ Erro ao enviar E-mail!");
        console.error("Detalhes do erro:", {
            message: error.message,
            code: error.code,
            command: error.command,
            responseCode: error.responseCode,
            response: error.response
        });

        // Log específico para problemas comuns
        if (error.code === 'EAUTH') {
            console.error("🔐 Erro de autenticação - Verifique usuário e senha");
        } else if (error.code === 'ECONNECTION') {
            console.error("🌐 Erro de conexão - Verifique host e porta");
        } else if (error.code === 'ETIMEDOUT') {
            console.error("⏰ Timeout - Verifique se a porta está liberada");
        }

        return false;
    }
}