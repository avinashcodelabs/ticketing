import { OrderCancelEvent, Publisher, Subjects } from "@avinashcodelabs/common";

class OrderCancelPublisher extends Publisher<OrderCancelEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

export { OrderCancelPublisher };
