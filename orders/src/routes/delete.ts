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

const router = Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;

    await order.save();
    res.status(200).send(order);
  }
);

export { router as deleteOrderRouter };
