import { OrderCreateEvent, Publisher, Subjects } from "@avinashcodelabs/common";

class OrderCreatePublisher extends Publisher<OrderCreateEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

export { OrderCreatePublisher };
