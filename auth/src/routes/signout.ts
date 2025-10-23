import { Router } from "express";
import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

const router = Router();

router.post("/api/users/signout", currentUser, requireAuth, (req, res) => {
    req.session = null;
    res.send({});
})

export {
    router as signoutRouter
}