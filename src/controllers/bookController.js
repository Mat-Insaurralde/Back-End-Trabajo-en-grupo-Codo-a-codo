import db from '../db/db.js';



const createBook =  (req, res) => {

    const { titulo, autor, anio, tapa } = req.body;

  

    //Vefifico que ingrese los datos
    if (!titulo || !autor || !anio || !tapa) return res.status(400).json({ message: 'Faltan datos en el registro' });


    const sql = 'INSERT INTO libros ( titulo , autor , anio , tapa ) VALUES ( ?  , ?  , ? , ? ); ';


    db.query(

        sql,

        [titulo, autor, anio, tapa],

        (err, results) => {

            if (err) {
                res.status(500).json({ error: err.sqlMessage });
                return;
            }


            if (results.length === 0) res.status(404).send({ "error": "No se encontró el usuario" });


            res.status(201).json({ message: 'Libro creado!', bookId: results.insertId });
        });

};

const updateBook = async (req, res) => {

    const { id } = req.params;

    const { titulo, autor, anio, tapa } = req.body;

    //Vefifico que ingrese los datos
    if (!titulo &&  !autor &&  !anio && !tapa) return res.status(400).json({ message : 'Faltan datos para la actualizacion' });


 // Construir dinámicamente la consulta SQL y los valores
 const consulta = [];
 const valores = [];

 // Construcción condicional de la consulta
 if (titulo !== undefined) {
   consulta.push('titulo = ?');
   valores.push(titulo);
 }
 if (autor !== undefined) {
   consulta.push('autor = ?');
   valores.push(autor);
 }
 if (anio !== undefined) {
   consulta.push('anio = ?');
   valores.push(anio);
 }
 if (tapa !== undefined) {
    consulta.push('tapa = ?');
    valores.push(tapa);
  }
 

 const sql = `UPDATE libros SET  ${consulta.join(', ')} WHERE id = ? ;`;
 
 valores.push(id);

 

     db.query(

        sql,

        valores,

        (err, results) => {
            if (err) {
                console.error('Error al actualizar el libro:', err);
                res.status(500).send('Infernar Server Error');
                return;
            }

            if (results.affectedRows === 0) return res.status(404).json({ mensaje: "libro no encontrado" });

            res.status(200).json({ mensaje: "libro actualizado!" });
        }



     )

};

const getBookById = async (req, res) => {

    const { id } = req.params;


    const sql = 'SELECT * FROM libros WHERE id = ?;';

    db.query(
        sql,

        [id],

        (err, results) => {

            if (err) {
                console.error('Error al obtener el libro:', err);
                res.status(500).send('Infernar Server Error');
                return;
            }

            if (results.length === 0) res.status(404).send({ "error": "No se encontró el libro" });


            res.status(200).json({ libro: results[0] });


        });

};

const getAllBooks = async (req, res) => {

    const sql = 'SELECT * FROM libros';


    db.query(sql, (err, results) => {
        //si sucede algun error
        if (err) {
            console.error('Error al obtener los libros:', err);
            res.status(500).send('Infernar Server Error');
            return;
        }

        //si no hay libros
        if (results.length === 0) res.status(200).send('No hay libros');

        res.status(200).json({ libros: results });
    });
};


const deleteBook = async (req, res) => {

    const { id } = req.params;

    const sql = 'DELETE FROM libros WHERE id = ?';


    db.query(

        sql, //La consulta SQL  

        [id], //Siempre se manda un array por mas que sea uno


        (err, results) => {
            //Si hay error
            if (err) {
                console.error('Error al eliminar el libro:', err);
                res.status(500).send('Infernar Server Error');
                return;
            }


            if (results.affectedRows === 0) return res.status(404).json({ mensaje: "libro no encontrado" });



            // Si todo va bien
            res.status(200).json({ mensaje: "libro borrado!" });
        });




};


export default {
    createBook,
    updateBook,
    getBookById,
    deleteBook,
    getAllBooks
};