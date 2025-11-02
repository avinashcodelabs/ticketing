import {
  ExpirationCompleteEvent,
  Listener,
  NotFoundError,
  OrderStatus,
  PaymentCreateEvent,
  Subjects,
  TicketCreateEvent,
} from "@avinashcodelabs/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderCancelPublisher } from "../publishers/order-cancel-publisher";

class PaymentCreateListener extends Listener<PaymentCreateEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: PaymentCreateEvent["data"], msg: Message) {
    console.log(`Data` + JSON.stringify(data));

    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("order not found to update the payment status");
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    // Send Order update event here
    // May be it's not required, as no service is interested in processing order complete status.

    msg.ack();
  }
}

export { PaymentCreateListener };
