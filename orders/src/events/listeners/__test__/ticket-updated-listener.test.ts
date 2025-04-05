import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@tkhtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    price: 10,
    title: "new concert",
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };

  // create a fake image object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };
  // return all of this stuff
  return { listener, data, message };
};

it("finds, updates and saves a ticket", async () => {
  const { data, listener, message } = await setup();

  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(data?.id);
  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { data, listener, message } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { message, data, listener } = await setup();

  data.version = 10;
  try {
    await listener.onMessage(data, message);
  } catch (error) {}

  expect(message.ack).not.toHaveBeenCalled();
});
