import { Router } from "express";
import { getStallById, updateStallData, getAllStalls } from "../controllers/stallcontroller";
import { isAuthenticatedStall } from "../middleware/auth";

const router = Router();

router.get('/stalls', getAllStalls);

router.get('/stalls/:id', getStallById);

router.post('/stalls/update-data', isAuthenticatedStall, updateStallData);

export default router;