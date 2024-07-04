import db from '../db/db.js'

   

const getAllUsers = async (req, res) => {

  const sql = 'SELECT * FROM usuarios';

  // Utilizamos .query para enviar la consulra a la bbdd
  // Primer parametro la consulta, segundo una función callback
  db.query(sql, (err, results) => {
    //si sucede algun error
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      res.status(500).send('Infernar Server Error');
      return;
    }

    // Si todo va bien
    res.status(200).json({ usuarios: results });
  });
};



const deleteUser = async (req, res) => {

  const { id } = req.params;

  const sql = 'DELETE FROM usuarios WHERE id = ?';


  db.query(

    sql, //La consulta SQL  

    [id], //Siempre se manda un array por mas que sea uno


    (err, results) => {
      //Si hay error
      if (err) {
        console.error('Error al eliminar el usuario:', err);
        res.status(500).send('Infernar Server Error');
        return;
      }


      if (results.affectedRows === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });



      // Si todo va bien
      res.status(200).json({ mensaje: "Usuario borrado!" });
    });

};



const updateUser = async (req, res) => {


  const { id } = req.params;

  const { nombre, email, edad } = req.body;

  //Vefifico que ingrese los datos
  if (!nombre && !email && !edad) return res.status(400).json({ message: 'Faltan datos para la actualizacion' });

  // Construir dinámicamente la consulta SQL y los valores
  const consulta = [];
  const valores = [];

  // Construcción condicional de la consulta
  if (nombre !== undefined) {
    consulta.push('nombre = ?');
    valores.push(nombre);
  }
  if (email !== undefined) {
    consulta.push('email = ?');
    valores.push(email);
  }
  if (edad !== undefined) {
    consulta.push('edad = ?');
    valores.push(edad);
  }

  const sql = `UPDATE usuarios SET ${consulta.join(', ')} WHERE id = ?`;
  valores.push(id);



  db.query(

    sql,

    valores,

    (err, results) => {
      //Si hay error
      if (err) {
        console.error('Error al actualizar el usuario:', err);
        res.status(500).send('Infernar Server Error');
        return;
      }

      if (results.affectedRows === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });

      // Si todo va bien
      res.status(200).json({ mensaje: "Usuario actualizado!" });

    });


};

const getUserById = async (req, res) => {

  const { id } = req.params;


  const sql = 'SELECT * FROM usuarios WHERE id = ?;';

  db.query(
    sql,

    [id],

    (err, results) => {

      if (err) {
        console.error('Error al obtener el usuario:', err);
        res.status(500).send('Infernar Server Error');
        return;
      }

      if (results.length === 0) res.status(404).send({ "error": "No se encontró el usuario" });



      res.status(200).json({ nombre: results[0].nombre, edad: results[0].edad });


    });
};


//METODO GUARDADO DE LIBRO FAVORITO

const addFavorite = async (req, res) => {

  const { email, libroId } = req.body;

  if (!email, !libroId) return res.status(400).json({ message: "Faltan datos" });



  db.query('SELECT id FROM usuarios WHERE email = ? ',

    [email],

    (err, userResults) => {

      if (err) {
        return res.status(500).send(err.message);
      }


      if (userResults.length === 0) {
        return res.status(404).send('Usuario no encontrado');
      }


      const usuarioId = userResults[0].id;

      db.query('SELECT id FROM libros WHERE id = ?',

        [libroId],

        (err, bookResults) => {

          if (err) {
            return res.status(500).send(err.message);
          }
          if (bookResults.length === 0) {
            return res.status(404).send('Libro no encontrado');
          }

        });

      db.query('SELECT * FROM favoritos WHERE usuario_id = ? AND libro_id = ?',

        [usuarioId, libroId],

        (err, favoriteResults) => {

          if (err) {
            return res.status(500).send(err.message);
          }

          if (favoriteResults.length > 0) {
            return res.status(400).send('El libro ya está en favoritos');
          }




          db.query('INSERT INTO favoritos (usuario_id, libro_id) VALUES (?, ?)',

            [usuarioId, libroId],

            (err, result) => {

              if (err) {
                return res.status(500).send(err.message);
              }
              res.status(200).send('Libro añadido a favoritos');



            });

        });



    });

};



//METODO BUSCAR LIBROS FAVORITOS


const getFavorites = async (req, res) => {

  const { id } = req.params;

  db.query('SELECT id FROM usuarios WHERE id = ?',

    [id],

    (err, userResults) => {

      if (err) {
        return res.status(500).send(err.message);
      }
      if (userResults.length === 0) {
        return res.status(404).send('Usuario no encontrado');
      }

      const usarioId = userResults[0].id;

      db.query('SELECT libros.* FROM libros JOIN favoritos ON libros.id = favoritos.libro_id WHERE favoritos.usuario_id = ?',
        [usarioId],

        (err, results) => {

          if (err) {
            return res.status(500).send(err.message);
          }

          if (results == 0) return res.status(404).send('No hay libros favoritos');


          res.status(200).json({ librosFavoritos: results });

        });

    });
};


//METODO ELIMINAR LIBRO DE FAVORITO


const deleteFavorite = async (req, res) => {

   const { usuarioId } = req.params;

  const { libroId } = req.body;

  
  db.query('DELETE FROM favoritos WHERE usuario_id = ? AND libro_id = ?',
    
    [usuarioId, libroId],
    
    (err, results) => {
    
      if (err) {
      return res.status(500).send(err.message); 
     }
   
     if (results.affectedRows === 0) {
      return res.status(404).send({message: "Nose ah encontrado el favorito a eliminar"}); // No se encontró el favorito
    }

    res.status(200).send({message: "Se ha eliminado de favoritos"}); 
  });

};






export default {
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  addFavorite,
  getFavorites,
  deleteFavorite
};

