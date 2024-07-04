
import jwt from 'jsonwebtoken';

import configJWT from '../config/configJWT.js';



export default  (req,res,next) => {

//Obtiene el token del encabezado de autorizacion
const authHeader  = req.cookies.access_token;



if(!authHeader) return res.status(400).send({auth:false,message:'No se encontro el token'})



const token = authHeader;
// Verificar si el token tiene el prefijo 'Bearer '
if (token.startsWith('Bearer ')) {
    token = token.slice(7); // Eliminar 'Bearer ' del inicio del token
  }
  

if (!token) return res.status(403).send({ auth: false , message : 'Acceso no autorizado'}); 


jwt.verify(token , configJWT.secretKey , (err,decoded)=>{

if (err) return res.status(500).send({auth:false,message: 'Fallo al verificar el token'});


//Si el token es valido, almacena el ID del usuario decodificado en la solicitud
req.userId = decoded.id;
//Llama a la siguiente funcion de middleware o controlador
next();


});





}