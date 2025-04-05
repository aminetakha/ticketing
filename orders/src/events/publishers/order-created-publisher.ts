import { Publisher, Subjects, OrderCreatedEvent } from "@tkhtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
