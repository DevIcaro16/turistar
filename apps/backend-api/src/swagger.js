import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Backend Service API",
        description: "Gerado automaticamente com documentação do Swagger!",
        version: "1.0.1"
    },

    host: "localhost:8000",
    schemes: ["http"],

};

const outputFile = "./swagger-output.json";
const endpointsFile = ["./routes/router.ts",];

swaggerAutogen()(outputFile, endpointsFile, doc); 