import express from "express";

import userController from '../controllers/userController.js';


const router = express.Router();

router.put('/:id',verifyTokenMiddleware,userController.updateUser);
router.get('/',userController.getAllUsers );
router.get('/:id', userController.getUserById);
router.delete('/:id',verifyTokenMiddleware, userController.deleteUser);

export default router;