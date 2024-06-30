import express from 'express';

import bookController from '../controllers/bookController.js';

import verifyTokenMiddleware from "../middlewares/verifyTokenMiddleware.js";


const route = express.Router();


route.put('/:id',verifyTokenMiddleware,bookController.updateBook);
route.get('/',bookController.getAllBooks);
route.get('/:id', bookController.getBookById);
route.delete('/:id',verifyTokenMiddleware, bookController.deleteBook);
route.post('/',verifyTokenMiddleware, bookController.createBook);





export default route;


