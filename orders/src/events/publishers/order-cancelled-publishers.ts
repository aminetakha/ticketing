import { Publisher, Subjects, OrderCancelledEvent } from "@tkhtickets/common";

export class OrderCancelledPblisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
