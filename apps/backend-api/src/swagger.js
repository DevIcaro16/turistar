import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Backend Service API",
        description: "Gerado automaticamente com documentação do Swagger!",
        version: "1.0.1"
    },

    host: process.env.NODE_ENV === 'production'
        ? (process.env.DOMAIN_NAME || process.env.EC2_PUBLIC_IP || "www.turistarturismo.shop")
        : `${process.env.EC2_PUBLIC_IP || process.env.DOMAIN_NAME || "localhost"}:${process.env.PORT || "8000"}`,
    basePath: "/api/",
    schemes: process.env.NODE_ENV === 'production' ? ["https"] : ["http"],

    // Configurações adicionais para evitar conflitos
    consumes: ['application/json'],
    produces: ['application/json'],

};

const outputFile = "./swagger-output.json";
const endpointsFile = ["./routes/router.ts",];

swaggerAutogen()(outputFile, endpointsFile, doc); 