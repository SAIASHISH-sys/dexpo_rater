import { Router } from "express";
import { createInvestment, getUserInvestments, deleteInvestment } from "../controllers/investcontroller";
import { authenticateUserJWT } from "../middleware/auth";


const router = Router();

router.use(authenticateUserJWT);

router.post('/users/invest', createInvestment);

router.get('/users/myportfolio', getUserInvestments);

router.delete('/users/:investment_id', deleteInvestment);

export default router;