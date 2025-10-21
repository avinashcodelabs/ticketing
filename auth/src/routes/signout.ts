import { Router } from "express";

const router = Router();

router.post("/api/users/signout", (req, res) => {
    res.send('noice knowing you!');
})

export {
    router as signoutRouter
}