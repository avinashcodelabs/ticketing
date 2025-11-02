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
    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
