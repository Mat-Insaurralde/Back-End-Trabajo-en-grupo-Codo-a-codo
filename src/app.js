import cors from 'cors';

import express from "express";
//Importamos variables de entorno
import 'dotenv-flow/config';

import authRoutes from './routes/authRoutes.js';

import userRoutes from './routes/userRoutes.js'

import bookRoutes from './routes/bookRoutes.js';





const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());             
           
app.use(express.urlencoded({ extended: true }));


app.use(
    cors( { 
    origin: [process.env.ORIGIN_CORS ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200 // algunos navegadores antiguos (IE11, varios SmartTVs) chokan con 204
      }));
   



app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/book',bookRoutes);




app.listen(PORT,()=> console.log("Servidor iniciado en el puerto: "+ PORT ));


