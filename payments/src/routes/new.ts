import { Router } from "express";
import type { Response, Request } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  requireAuth,
  OrderStatus,
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
} from "@avinashcodelabs/common";
import mongoose from "mongoose";
import { Order } from "../model/order";
import { stripe } from "../stripe";
import { Payment } from "../model/payment";
import { PaymentCreatePublisher } from "../events/publisher/payment-create-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("token must be provided"),
    body("orderId").not().isEmpty().withMessage("OrderId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an  cancelled/expired order");
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100, // by default its cents, thats why to convert to dollars, x*100
      source: token,
    });

    const payment = new Payment({
      orderId: orderId,
      stripeId: charge.id,
    });
    await payment.save();

    // publish payment complete events
    await new PaymentCreatePublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send(payment);
  }
);

export { router as createChargeRouter };
