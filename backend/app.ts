import dotenv from 'dotenv';
import express from 'express';
import * as colors from 'colors';

import { pgPool } from './db/postgresql.ts';

// ENV vars config 
dotenv.config();

// Express Config
const app = express();
const port = process.env.PORT || 3300;

// Routes
app.get('/', (req,res)=>{
    res.send('Arichivivault is open and running')
});

// Listening
app.listen(port, ()=>{
    console.log(`Server running on port: ${port}.`.underline.green)
})