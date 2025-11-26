/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from 'redis';
import { envVars } from './env';

export const redisClient = createClient({
    username: envVars.REDIS.REDIS_USERNAME,
    password: envVars.REDIS.REDIS_PASSWORD,
    socket: {
        host: envVars.REDIS.REDIS_HOST,
        port: Number(envVars.REDIS.REDIS_PORT)
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

export const connectRedis = async() =>{
    try{
        if(!redisClient.isOpen){
            await redisClient.connect();
            console.log("Redis Connected")
        }
    }catch(err: any){
        throw new Error(err)
    }
}


