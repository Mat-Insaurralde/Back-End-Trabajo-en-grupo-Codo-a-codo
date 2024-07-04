import mysql from 'mysql2';

import 'dotenv-flow/config';



const connection = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
);


connection.connect((error) => {


  if (error) {
    console.error('Error al conectar con la base de datos ', error);
    return;
  }

  console.log('Conectado a la base de datos');



  // Código para crear la base de datos si no existe
  connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (error, results, fields) => {

    if (error) {
      console.error('Error al crear la base de datos:', error);
      return;
    }

    console.log('Base de datos creada o ya existente');

  });


  //Crear tablas



  connection.changeUser({ database: process.env.DB_NAME }, (err) => {

    if (err) {
      console.error(`Error al cambiar a ${process.env.DB_NAME}`, err);
      return;
    }




    const createTableUsers = `

CREATE TABLE IF NOT EXISTS usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
telefono VARCHAR(20) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
contrasena VARCHAR(255) NOT NULL, 
fecha_nacimiento DATE NOT NULL

);

`;

    const createTableBooks = `

CREATE TABLE IF NOT EXISTS libros (
id INT AUTO_INCREMENT PRIMARY KEY,
titulo VARCHAR(100) NOT NULL,
autor VARCHAR(100) NOT NULL,
anio INT NOT NULL, 
tapa VARCHAR(200) NOT NULL
);
 
`;

    const createFavoritesTable = `

CREATE TABLE IF NOT EXISTS favoritos (

  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  libro_id INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (libro_id) REFERENCES libros(id),
  UNIQUE KEY unique_favorito (usuario_id, libro_id)

);

`;


    connection.query(createTableUsers, (error, results) => {

      if (error) {
        console.log('Error al crear la tabla: ', error);
        return;
      }

      console.log('Tabla Usuarios creada/existente!');

    });



    connection.query(createTableBooks,
      (error, results) => {
        if (error) {
          console.log('Error al crear la tabla: ', error);
          return;
        }

        console.log('Tabla libros creada/existente!');
      }
    );



    connection.query(createFavoritesTable,
      (error, results) => {
        if (error) {
          console.log('Error al crear la tabla: ', error);
          return;
        }

        console.log('Tabla favoritos creada/existente!');
      }
    );





  });


});


export default connection;