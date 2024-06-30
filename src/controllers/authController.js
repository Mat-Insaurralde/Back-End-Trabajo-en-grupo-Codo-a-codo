
import db from '../db/db.js';
//Importamos el modulo para manejar JWT
import jwt from 'jsonwebtoken';
//Importamos el modulo para cifrar contraseñas
import bcrypt from 'bcryptjs';
//Importamos la configuracion del token
import config from '../config/configJWT.js';



const register = (req, res) => {

  const { nombre, email, password, edad } = req.body;

 //Vefifico que ingrese los datos
 if(!nombre || !email || !password || !edad ) return res.status(400).json({message : 'Faltan datos en el registro'});


  const contrasena = bcrypt.hashSync(password, 8);

  const sql = 'INSERT INTO usuarios ( nombre , email , contrasena , edad ) VALUES ( ?  , ?  , ? , ? ); ';



  db.query(

    sql,

    [nombre, email, contrasena, edad],

    (err, result) => {

      if (err) {
        console.log('Error al registrar usuario: ' + err);
        res.status(500).send('Infernar Server Error');
        return;
      }

      if (result.affectedRows === 0) return res.status(400).json({ message: 'No se pudo registrar el usuario' });


      //genera un token JWT para el nuevo usuario    // `result.insertId` contiene el ID del nuevo usuario insertado
      const token = jwt.sign({ id: result.insertId }, config.secretKey, { expiresIn: config.tokenExpiresIn });

      //Envia el token como respuesta al cliente
      res.status(201).json({ message: 'Usuario creado!', usuarioId: result.insertId , auth: true, token  });


    });


};


const login = (req, res) => {

  const { email, password } = req.body;

  //Vefifico que ingrese los datos
  if(!email || !password) return res.status(400).json({message : 'email o contraseña no ingresados'});

  const sql = 'SELECT * FROM usuarios WHERE email = ? ;';


  db.query(
    sql,

    [email],

    (err, results) => {

      if (err) {
        console.error('Error al buscar el usuario!', err);
        res.status(500).send('Infernar Server Error');
        return;
      }

      if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });


      const user = results[0];

      const passwordIsValid = bcrypt.compareSync(password, user.contrasena);

      if (!passwordIsValid) return res.status(401).json({ auth: false, token: null });


     //Genera un token usando el id del usuario
      const token = jwt.sign({id:user.id},config.secretKey,{expiresIn:config.tokenExpiresIn});
        
      res.status(200).json({auth:true,token});

    });




};


export default {
  register,
  login

};