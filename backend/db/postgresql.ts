import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

const pgPool = new Pool({
    connectionString: process.env.POSTGRES_URI,
});

pgPool.connect()
    .then(()=>{
        console.log(`✅ PostgreSQL connection successful`);
    })
    .catch((err)=>{
        console.log(`❌ PostgreSQL connection failed: ${err.message}`)
    });

export { pgPool }