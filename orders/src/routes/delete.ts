import { Router } from "express";
import type { Response, Request } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@avinashcodelabs/common";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelPublisher } from "../events/publishers/order-cancel-publisher";

const router = Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;

    await order.save();

    // Publish order cancelled event to payment service
    await new OrderCancelPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket?.id,
      },
    });

    res.status(200).send(order);
  }
);

export { router as deleteOrderRouter };
