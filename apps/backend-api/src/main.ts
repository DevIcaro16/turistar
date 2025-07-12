import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from "swagger-ui-express";
import { errorMiddleware } from '../../../packages/error-handle/error-middleware.js';
import allRoutes from './routes/router.js';
const swaggerDocument = require("./swagger-output.js");


const app = express();

// app.use(cors({
//     origin: ['http://localhost:3000'],
//     allowedHeaders: ['Authorization', "Content-Type"],
//     credentials: true
// }));

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API' });
});


//Docs - Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs-json", (req, res) => {
    res.json(swaggerDocument);
});

app.use("/api/", allRoutes);

app.use(errorMiddleware);

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 8000;

const server = app.listen(port, host, () => {
    console.log(`Servidor on em http://${host}:${port}`);
});

server.on('error', (err) => {
    console.log("Erro no Servidor: ", err);
    console.log();
});
