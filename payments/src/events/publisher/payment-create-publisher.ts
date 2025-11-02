import {
  PaymentCreateEvent,
  Publisher,
  Subjects,
} from "@avinashcodelabs/common";

class PaymentCreatePublisher extends Publisher<PaymentCreateEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

export { PaymentCreatePublisher };
