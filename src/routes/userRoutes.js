import express from "express";

import userController from '../controllers/userController.js';



const router = express.Router();

router.put('/:id',  userController.updateUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.delete('/:id',  userController.deleteUser);
//Favoritos del usuario
router.post('/favorite', userController.addFavorite);
router.get('/favorites/:id', userController.getFavorites);
router.delete('/favorite/:usuarioId', userController.deleteFavorite);




export default router;