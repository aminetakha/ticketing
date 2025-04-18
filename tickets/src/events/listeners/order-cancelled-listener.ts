import { Listener, OrderCancelledEvent, Subjects } from "@tkhtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticker-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: undefined });
    await ticket.save();
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });
    msg.ack();
  }
}
