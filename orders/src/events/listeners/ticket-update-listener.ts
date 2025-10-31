import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdateEvent,
} from "@avinashcodelabs/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

class TicketUpdateListener extends Listener<TicketUpdateEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketUpdateEvent["data"], msg: Message) {
    console.log(`Data` + JSON.stringify(data));
    const { id, title, price } = data;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new Error("Ticket not found to update it");
    }
    ticket.set({
      title,
      price,
    });

    await ticket.save();
    msg.ack();
  }
}

export { TicketUpdateListener };
