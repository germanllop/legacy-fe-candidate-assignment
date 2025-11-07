import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import config from './config';

const app = express();

app.use(cors({
    origin: config.corsOrigin,
}));
app.use(express.json());

// Routes
app.use('/api', routes);

// Global error handler 
app.use(errorHandler);

export default app;
