import {
  Listener,
  NotFoundError,
  OrderCancelEvent,
  OrderCreateEvent,
  OrderStatus,
  Subjects,
} from "@avinashcodelabs/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

class OrderCancelListener extends Listener<OrderCancelEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  async onMessage(data: OrderCancelEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found to update the orderId null");
    }

    ticket.set("orderId", undefined);
    await ticket.save();

    // Publish, edit ticket event, once it saved into DB. since we are updating orderId column
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId!,
      version: ticket.version,
    });
    msg.ack();
  }
}
export { OrderCancelListener };
