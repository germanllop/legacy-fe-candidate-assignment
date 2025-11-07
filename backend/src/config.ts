import * as dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: string;
    env: string;
    corsOrigin: string;
}

const config: Config = {
    port: process.env.PORT || '3000',
    env: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

export default config;
