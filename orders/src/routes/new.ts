import { Router } from "express";
import type { Response, Request } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  requireAuth,
  OrderStatus,
  NotFoundError,
  BadRequestError,
} from "@avinashcodelabs/common";
import mongoose from "mongoose";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { OrderCreatePublisher } from "../events/publishers/order-create-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 0.5 * 60; // 0.5min or 30sec

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // verifying ticketId is not just any number but mongodb generated id
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // See if tickets exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // See if ticket is reserved at this moment?
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // set expiration to this about to be reserved ticket
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build order
    const order = new Order({
      userId: req.currentUser?.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    // save it to db
    await order.save();

    // Publish order created event to payment service
    await new OrderCreatePublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiredAt: order.expiresAt?.toISOString()!,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
