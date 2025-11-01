import {
  Listener,
  NotFoundError,
  OrderCreateEvent,
  OrderStatus,
  Subjects,
} from "@avinashcodelabs/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

class OrderCreateListener extends Listener<OrderCreateEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  async onMessage(data: OrderCreateEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set("orderId", data.id);
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
export { OrderCreateListener };
