import { Router } from "express";
import type { Response, Request } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@avinashcodelabs/common";
import { Password } from "../services/password";

const router = Router();

router.post("/api/users/signin", [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("You must supply a password"),
], validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError("User not found/Invalid credentials.")
    }

    const passwordsMatch = Password.compare(existingUser.password, password);
    if (!passwordsMatch) {
        throw new BadRequestError("User not found/Invalid credentials.")
    }

    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!)

    // this session prop is from cookie-session, this takes cares of 
    // serializing the data and sending along with response and telling browser to store it.
    req.session = {
        jwt: userJwt
    }

    res.status(200).send(existingUser);
})

export {
    router as signinRouter
}