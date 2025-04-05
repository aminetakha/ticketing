import { PaymentCreatedEvent, Publisher, Subjects } from "@tkhtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
