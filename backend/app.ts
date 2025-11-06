import dotenv from 'dotenv';
import express from 'express';
import * as colors from 'colors';

import { prisma } from './config/db/prisma.ts';
import { mongoDBConnection } from './config/db/mongodb.ts';
import { connectRedis } from './config/db/redis.service.ts';

// Middleware
import { errorHandler } from "./middleware/error_handler_middleware/errorHandler.ts";

// Routes
import auth_router from "./routers/auth_router.ts";

// ENV vars config 
dotenv.config();

//DB Connections
async function bootstrap(){
    await mongoDBConnection(process.env.MONGO_URI);
    await connectRedis(`${process.env.REDIS_URL}`);
}
bootstrap();


// Express Config
const app = express();
app.use(express.json());
const port = process.env.PORT || 3300;



// Routes
app.get('/', (req,res)=>{
    res.send('Arichivivault is open and running')
});

app.use( '/api/auth', auth_router);

// Declare Error handling after routes
app.use(errorHandler);

// Listening
app.listen(port, ()=>{
    console.log(`Server running on port: ${port}.`.underline.green)
})