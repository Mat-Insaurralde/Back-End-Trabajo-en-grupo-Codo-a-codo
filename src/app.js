
import express from "express";

import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';

import userRoutes from './routes/userRoutes.js'

import bookRoutes from './routes/bookRoutes.js';

import verifyTokenMiddleware from "./middlewares/verifyTokenMiddleware.js";

const app = express();
             
             //Puerto del host si no existe usa el 3000
const PORT = process.env.PORT || 3000;




app.use(express.json());

app.use('/auth',authRoutes);
app.use('/user',verifyTokenMiddleware,userRoutes);
app.use('/book',verifyTokenMiddleware,bookRoutes);




app.listen(PORT,()=> console.log("Servidor iniciado en el puerto: "+ PORT ));

