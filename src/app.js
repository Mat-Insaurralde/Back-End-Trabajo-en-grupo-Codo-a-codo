import cors from 'cors';

import express from "express";
//Importamos variables de entorno
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';

import userRoutes from './routes/userRoutes.js'

import bookRoutes from './routes/bookRoutes.js';



const app = express();
             
             //Puerto del host si no existe usa el 3000
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.ORIGIN_CORS , methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));




app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/book',bookRoutes);




app.listen(PORT,()=> console.log("Servidor iniciado en el puerto: "+ PORT ));


