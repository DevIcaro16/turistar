import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from "swagger-ui-express";
import { errorMiddleware } from '../../../packages/error-handle/error-middleware.js';
import allRoutes from './routes/router.js';
import fileUpload from 'express-fileupload';
import stripeRouter from './routes/stripe/router';
import { createServer } from 'http';
import { Server } from 'socket.io';
const swaggerDocument = require("./swagger-output.js");

const app = express();

// Configuração CORS para produção
// const allowedOrigins = [
//     'http://localhost:3000',
//     'http://127.0.0.1:3000',
//     'http://10.0.0.103:3000',
//     process.env.FRONTEND_URL, // URL do frontend em produção
//     process.env.EC2_PUBLIC_IP, // IP público da EC2
//     process.env.DOMAIN_NAME   // Domínio customizado se houver
// ].filter(Boolean); // Remove valores undefined

// app.use(cors({
//     origin: function (origin, callback) {
//         // Permitir requests sem origin (mobile apps, Postman, etc)
//         if (!origin) return callback(null, true);

//         if (allowedOrigins.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             // console.log('CORS blocked origin:', origin);
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true
// }));

// // Middleware adicional para garantir headers CORS
// app.use((req, res, next) => {
//     const origin = req.headers.origin;
//     if (origin && allowedOrigins.includes(origin)) {
//         res.header('Access-Control-Allow-Origin', origin);
//     }
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     res.header('Access-Control-Allow-Credentials', 'true');

//     if (req.method === 'OPTIONS') {
//         res.sendStatus(200);
//     } else {
//         next();
//     }
// });


// Configuração CORS para produção
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://localhost:3000',
    'https://www.turistarturismo.shop',
    'http://www.turistarturismo.shop',
    process.env.FRONTEND_URL, // URL do frontend em produção
    process.env.EC2_PUBLIC_IP, // IP público da EC2
    process.env.DOMAIN_NAME   // Domínio customizado se houver
].filter(Boolean); // Remove valores undefined

app.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sem origin (mobile apps, Postman, etc)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// Middleware adicional para garantir headers CORS
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
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
    res.send({
        'message': 'Hello API',
        'status': 'running',
        'timestamp': new Date().toISOString(),
        'environment': process.env.NODE_ENV || 'development'
    });
});

// Endpoint de health check
app.get('/health', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        swaggerUrl: process.env.NODE_ENV === 'production'
            ? 'https://www.turistarturismo.shop/api-docs'
            : 'http://localhost:8000/api-docs'
    });
});


//Docs - Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
        url: '/docs-json',
        docExpansion: 'list',
        filter: true,
        showRequestHeaders: true,
        tryItOutEnabled: true,
        requestInterceptor: (req: any) => {
            // Adicionar headers CORS para requisições do Swagger
            req.headers['Access-Control-Allow-Origin'] = '*';
            req.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            req.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
            return req;
        }
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Turistar API Documentation"
}));

app.get("/docs-json", (req, res) => {
    // Adicionar headers CORS para o endpoint de documentação
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    // Forçar HTTPS em produção
    if (process.env.NODE_ENV === 'production') {
        const modifiedDoc = {
            ...swaggerDocument,
            schemes: ['https'],
            host: process.env.DOMAIN_NAME || process.env.EC2_PUBLIC_IP || "www.turistarturismo.shop",
            basePath: "/api/"
        };
        res.json(modifiedDoc);
    } else {
        res.json(swaggerDocument);
    }
});

app.use("/api/", allRoutes);
app.use('/api/stripe', stripeRouter);

app.use(errorMiddleware);

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 8000;

// Criar servidor HTTP
const httpServer = createServer(app);

// Configurar Socket.IO
// const io = new Server(httpServer, {
//     cors: {
//         origin: allowedOrigins.filter(Boolean) as string[],
//         methods: ['GET', 'POST'],
//         credentials: true
//     }
// });

// Armazenar conexões por usuário
const userSockets = new Map<string, string>();
const driverSockets = new Map<string, string>();

// // Configurar eventos do Socket.IO
// io.on('connection', (socket) => {
//     // console.log('Cliente conectado:', socket.id);

//     // Autenticar usuário
//     socket.on('authenticate_user', (userId: string) => {
//         userSockets.set(userId, socket.id);
//         socket.join(`user_${userId}`);
//         // console.log(`Usuário ${userId} autenticado no socket ${socket.id}`);
//     });

//     // Autenticar motorista
//     socket.on('authenticate_driver', (driverId: string) => {
//         driverSockets.set(driverId, socket.id);
//         socket.join(`driver_${driverId}`);
//         // console.log(`Motorista ${driverId} autenticado no socket ${socket.id}`);
//     });

//     // Desconexão
//     socket.on('disconnect', () => {
//         // Remover usuário da lista
//         for (const [userId, socketId] of userSockets.entries()) {
//             if (socketId === socket.id) {
//                 userSockets.delete(userId);
//                 // console.log(`Usuário ${userId} desconectado`);
//                 break;
//             }
//         }

//         // Remover motorista da lista
//         for (const [driverId, socketId] of driverSockets.entries()) {
//             if (socketId === socket.id) {
//                 driverSockets.delete(driverId);
//                 // console.log(`Motorista ${driverId} desconectado`);
//                 break;
//             }
//         }
//     });
// });

// Iniciar servidor
httpServer.listen(port, host, () => {
    console.log(`✅ Servidor HTTP + WebSocket rodando em http://${host}:${port}`);
    console.log(`📚 API Docs: http://${host}:${port}/api-docs`);
});

// Exportar io para usar nos controllers
// export { io };

httpServer.on('error', (err: any) => {
    console.error('❌ Erro no Servidor:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.error('⚠️  Porta já está em uso. Tente usar outra porta.');
    }
});
