import {
  Listener,
  NotFoundError,
  OrderCreateEvent,
  OrderStatus,
  Subjects,
} from "@avinashcodelabs/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../expiration-queue";

class OrderCreateListener extends Listener<OrderCreateEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  async onMessage(data: OrderCreateEvent["data"], msg: Message) {
    const delayInMilliSeconds =
      new Date(data.expiredAt).getTime() - new Date().getTime();
    console.log("Waiting this many milliseconds => " + delayInMilliSeconds);
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delayInMilliSeconds,
      }
    );
    msg.ack();
  }
}
export { OrderCreateListener };
