import Redis from 'ioredis';

let redis: Redis | null = null;

const connectRedis = (url: string) =>{
    if(!redis){
        redis = new Redis(url);
        redis.on('connect', () => console.log(`✅ Connected to Redis`));
        redis.on('error', (err)=> console.log(`❌ Redis error: ${err}`));
    }
    return redis;
};

const getRedisClient = () =>{
    if(!redis) throw new Error(`Redis not initialized. Call connectRedis() first.`);
    return redis
};

export { connectRedis, getRedisClient }