import { Listener, Subjects, TicketCreateEvent } from "@avinashcodelabs/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

class TicketCreateListener extends Listener<TicketCreateEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketCreateEvent["data"], msg: Message) {
    console.log(`Data` + JSON.stringify(data));
    const { id, title, price } = data;
    const ticket = new Ticket({
      _id: id,
      title: title,
      price: price,
    });

    await ticket.save();
    msg.ack();
  }
}

export { TicketCreateListener };
