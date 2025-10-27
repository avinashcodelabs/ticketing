import {
  Publisher,
  Subjects,
  TicketCreateEvent,
} from "@avinashcodelabs/common";

class TicketCreatedPublisher extends Publisher<TicketCreateEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

export { TicketCreatedPublisher };
