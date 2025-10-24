import { Router } from "express";
import type { Request, Response } from "express";
import { currentUser } from "@avinashcodelabs/common";

const router = Router();

router.get("/api/users/currentuser", currentUser, (req: Request, res: Response) => {
    return res.send({ currentUser: req.currentUser || null });
})

export {
    router as currentUserRouter
}