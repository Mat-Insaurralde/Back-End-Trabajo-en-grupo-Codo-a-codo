import express from "express";

import userController from '../controllers/userController.js';

import verifyTokenMiddleware from "../middlewares/verifyTokenMiddleware.js";

const router = express.Router();

router.put('/:id',  userController.updateUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.delete('/:id',  userController.deleteUser);
router.post('/favorite', userController.addFavorite);
router.get('/favorites/:id', userController.getFavorites);
router.delete('/favorites', userController.deleteFavorite);




export default router;