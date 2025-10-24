import { Router } from "express";
import type { Response, Request } from "express";
import { body } from "express-validator";
import {
    validateRequest,
    requireAuth,
} from "@avinashcodelabs/common";
import { Ticket } from "../models/ticket";

const router = Router();

router.post(
    "/api/tickets",
    requireAuth,
    [
        body("title")
            .not()
            .isEmpty()
            .withMessage("Title is required"),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price is must be greater than 0"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;
        const ticket = new Ticket({ title, price, userId: req.currentUser?.id })
        await ticket.save()
        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
