
import  express  from 'express';

import verifyTokenMiddleware from "./middlewares/verifyTokenMiddleware.js";

import  authController from "../controllers/authController.js";


//crea un nuevo enrutador de express
const router = express.Router();



router.post('/register',authController.register);


router.post('/login' , authController.login);




export default router;