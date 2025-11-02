import {
  ExpirationCompleteEvent,
  Listener,
  NotFoundError,
  OrderStatus,
  Subjects,
  TicketCreateEvent,
} from "@avinashcodelabs/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderCancelPublisher } from "../publishers/order-cancel-publisher";

class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    console.log(`Data` + JSON.stringify(data));

    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("order not found to update the expiration status");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack(); // return early, no action.
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    // publish, that a order has been cancelled.
    await new OrderCancelPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket?.id,
      },
    });

    msg.ack();
  }
}

export { ExpirationCompleteListener };
