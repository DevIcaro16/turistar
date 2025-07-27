import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";

dotenv.config()

//SMTP

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


//Renderização do template do email
const renderEmailTemplate = async (templateName: string, data: Record<string, any>): Promise<string> => {

    const templatePath = path.join(
        process.cwd(),
        "apps",
        "backend-api",
        "src",
        "utils",
        "email-templates",
        `${templateName}.ejs`
    );

    return ejs.renderFile(templatePath, data);
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
            port: process.env.SMTP_PORT || 587,
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