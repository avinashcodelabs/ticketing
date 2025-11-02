import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@avinashcodelabs/common";

class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}

export { ExpirationCompletedPublisher };
