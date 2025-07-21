import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from "swagger-ui-express";
import { errorMiddleware } from '../../../packages/error-handle/error-middleware.js';
import allRoutes from './routes/router.js';
import fileUpload from 'express-fileupload';
import stripeRouter from './routes/stripe/router';
const swaggerDocument = require("./swagger-output.js");



const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://10.0.0.103:3000'],
    allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// Middleware adicional para garantir headers CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://10.0.0.103:3000');
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json());

app.use(cookieParser());

app.use(fileUpload());

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API' });
});


//Docs - Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs-json", (req, res) => {
    res.json(swaggerDocument);
});

app.use("/api/", allRoutes);
app.use('/api/stripe', stripeRouter);

app.use(errorMiddleware);

const host = process.env.HOST ?? '0.0.0.0'; // Mudança aqui: 0.0.0.0 para escutar em todas as interfaces
const port = process.env.PORT ? Number(process.env.PORT) : 8000;

const server = app.listen(port, host, () => {
    console.log(`Servidor rodando em http://${host}:${port}`);
});

server.on('error', (err) => {
    console.log("Erro no Servidor: ", err);
    console.log();
});
