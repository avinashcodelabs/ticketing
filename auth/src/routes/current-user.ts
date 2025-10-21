import { Router } from "express";

const router = Router();

router.post("/api/users/currentuser", (req, res) => {
    res.send('currentUser');
})

export {
    router as currentUserRouter
}