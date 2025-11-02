import {
  Listener,
  OrderCancelEvent,
  OrderStatus,
  Subjects,
} from "@avinashcodelabs/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../model/order";

class OrderCancelListener extends Listener<OrderCancelEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  async onMessage(data: OrderCancelEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new Error("order not found to update its cancelled event");
    }

    order.set("status", OrderStatus.Cancelled);
    await order.save();
    msg.ack();
  }
}

export { OrderCancelListener };
