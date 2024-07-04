import express from "express";

import userController from '../controllers/userController.js';

import verifyTokenMiddleware from "../middlewares/verifyTokenMiddleware.js";

const router = express.Router();

router.put('/:id',verifyTokenMiddleware,userController.updateUser);
router.get('/',userController.getAllUsers );
router.get('/:id', userController.getUserById);
router.delete('/:id',verifyTokenMiddleware, userController.deleteUser);
router.post('/favorite',userController.addFavorite);
router.get('/favorites/:id',userController.getFavorites);




export default router;