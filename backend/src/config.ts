import * as dotenv from 'dotenv';

dotenv.config();

interface Config {
    port:string;
    env:string;
}

const config:Config = {
    port: process.env.PORT || '3000',
    env: process.env.NODE_ENV || 'development',
};

export default config;