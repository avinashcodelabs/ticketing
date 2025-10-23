import type { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";

// this middleware must run after currentUser middleware because we gonna check req.currentUser prop
// to decide whether user is logged in or not.
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }
    next()
}

export {
    requireAuth
}