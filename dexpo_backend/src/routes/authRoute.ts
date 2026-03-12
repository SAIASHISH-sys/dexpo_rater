import { Router } from "express";
import passport, { Passport, use } from "passport";
import { stallLogin, userLogin } from "../controllers/authcontroller";

const router = Router();

//-- Investor Routers 
router.post("/users/login", userLogin);

//-- Stalls Routes 
router.post("/stalls/login", stallLogin);
router.get("/google", passport.authenticate('google',{scope: ['profile', 'email']}));
router.get("/google/callback", 
    passport.authenticate('google', {failureRedirect : '/login-failed'}),
    (req, res) =>{
        res.redirect(`{process.env}/stall-dashboard`)
    }

)

export default router;