import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@tkhtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
