import { Router } from "express";
import type { Request, Response } from "express";
import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

const router = Router();

router.get("/api/users/currentuser", currentUser, (req: Request, res: Response) => {
    return res.send({ currentUser: req.currentUser || null });
})

export {
    router as currentUserRouter
}