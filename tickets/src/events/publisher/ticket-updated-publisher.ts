import {
  Publisher,
  Subjects,
  TicketUpdateEvent,
} from "@avinashcodelabs/common";

class TicketUpdatedPublisher extends Publisher<TicketUpdateEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

export { TicketUpdatedPublisher };
