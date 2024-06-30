import express from 'express';

import bookController from '../controllers/bookController.js';



const route = express.Router();


route.put('/:id',bookController.updateBook);
route.get('/',bookController.getAllBooks);
route.get('/:id', bookController.getBookById);
route.delete('/:id', bookController.deleteBook);
route.post('/', bookController.createBook);





export default route;


