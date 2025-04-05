import { Publisher, Subjects, TicketUpdatedEvent } from "@tkhtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
