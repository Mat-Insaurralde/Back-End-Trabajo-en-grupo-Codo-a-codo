
import  express  from 'express';

import  authController from "../controllers/authController.js";


//crea un nuevo enrutador de express
const router = express.Router();



router.post('/register',authController.register);


router.post('/login' , authController.login);

router.get('/protected',(req,res)=>{
    res.status(200).send(req.id);
});


export default router;