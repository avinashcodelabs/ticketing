import { Router } from "express";
import type { Response, Request } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@avinashcodelabs/common";

const router = Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  res.status(200).send(ticket);
});

export { router as showTicketRouter };
