
import jwt from 'jsonwebtoken';

import configJWT from '../config/configJWT.js';



export default  (req,res,next) => {

//Obtiene el token del encabezado de autorizacion
const authheader = req.headers['authorization'];

if(!authheader) return res.status(400).send({auth:false,message:'No se encontro el token'})



//Extrae el encabezado del token (formato barer <token>)    
const token = authheader.split(' ')[1];

if (!token) return res.status(403).send({ auth: false , message : 'token malformado'}); 


jwt.verify(token , configJWT.secretKey , (err,decoded)=>{

if (err) return res.status(500).send({auth:false,message: 'Fallo al verificar el token'});


//Si el token es valido, almacena el ID del usuario decodificado en la solicitud
req.userId = decoded.id;
//Llama a la siguiente funcion de middleware o controlador
next();


});





}