import { differenceInYears, parseISO } from 'date-fns';

import db from '../db/db.js';
//Importamos el modulo para manejar JWT
import jwt from 'jsonwebtoken';
//Importamos el modulo para cifrar contraseñas
import bcrypt from 'bcryptjs';
//Importamos la configuracion del token
import config from '../config/configJWT.js';


const register = (req, res) => {


  const { nombre, email, telefono, password1, password2, fechaNac } = req.body;


  //Vefifico que ingrese los datos
  if (!nombre || !telefono || !email || !password1 || !password2 || !fechaNac) {
    return res.status(400).json({ message: 'Faltan datos en el registro' });
  }

  if (!password1 === password2) return res.status(400).json({ message: 'Las contraseñas no coinciden' });

  const fecha_nacimiento = parseISO(fechaNac);

  const fechaActual = new Date();


  if (differenceInYears(fechaActual, fecha_nacimiento) < 15) {
    return res.status(400).json({ message: 'La edad minima para registrarse es de 15' });
  }




  const contrasena = bcrypt.hashSync(password1, 8);

  const sql = 'INSERT INTO usuarios ( nombre , email ,telefono , contrasena ,fecha_nacimiento  ) VALUES ( ?  , ?  , ? , ? ,?); ';



  db.query(

    sql,

    [nombre, email, telefono, contrasena, fecha_nacimiento],

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
      res     //El nombre de la cookie
        .cookie('access_token', token, {
          httpOnly: true, //Evita que la cookie pueda ser accedida desde JavaScript , solo se accede a la cookie desde el servidor
          secure: false, //Evita que la cookie sea enviada por un protocolo no seguro
          sameSite: 'strict', //Solo se puede acceder a la cookie desde el mismo dominio 
          maxAge: 1000 * 60 * 60 //La cookie tiene tiempo de validez de una hora
        })
        .status(201)
        .json({ message: 'Usuario creado!', usuarioId: result.insertId, auth: true, token });


    });


};


const login = (req, res) => {

  const { email, password } = req.body;

  //Vefifico que ingrese los datos
  if (!email || !password) return res.status(400).json({ message: 'email o contraseña no ingresados' });

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
      const token = jwt.sign({ id: user.id, nombre: user.nombre }, config.secretKey, { expiresIn: config.tokenExpiresIn });


      res.cookie('access_token', token, {
        httpOnly: true,
        secure: false, // Asegúrate de que esté en false para desarrollo en HTTP
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 // 1 hora
      })
        .status(200)
        .json({ auth: true, token });

    });

};



const logout = (req, res) => {

  res.clearCookie('access_token')
    .status(200)
    .json({ message: 'Logout exitoso' });

};




export default {
  register,
  login,
  logout

};