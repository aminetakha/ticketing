import { Publisher, Subjects, TicketCreatedEvent } from "@tkhtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
