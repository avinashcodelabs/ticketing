import { Router } from "express";
import type { Response, Request } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { RequestValidationError, BadRequestError, validateRequest } from "@avinashcodelabs/common";
import { User } from "../models/user";

const router = Router();

router.post(
    "/api/users/signup",
    [
        body("email").isEmail().withMessage("Email must be valid."),
        body("password")
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage("Password must be between 4 and 20 characters."),
    ],
    validateRequest
    ,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError("Email already in use.")
        }
        const user = new User({ email, password });
        await user.save()

        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!)

        // this req.session prop is from cookie-session, this takes cares of 
        // serializing the data and sending along with response and telling browser to store it.
        req.session = {
            jwt: userJwt
        }

        res.status(201).send(user);
    }
)

export { router as signupRouter };
