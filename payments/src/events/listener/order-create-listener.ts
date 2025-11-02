import { Listener, OrderCreateEvent, Subjects } from "@avinashcodelabs/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../model/order";

class OrderCreateListener extends Listener<OrderCreateEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  async onMessage(data: OrderCreateEvent["data"], msg: Message) {
    const order = new Order({
      _id: data.id,
      status: data.status,
      userId: data.userId,
      price: data.ticket.price,
    });
    await order.save();
    msg.ack();
  }
}
export { OrderCreateListener };
