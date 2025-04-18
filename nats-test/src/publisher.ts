///<reference path="../node_modules/@types/node/index.d.ts"/>

import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");
  const ticketCreatedPublisher = new TicketCreatedPublisher(stan);

  try {
    await ticketCreatedPublisher.publish({
      id: "123",
      title: "concert",
      price: 20,
    });
  } catch (error) {
    console.log("🚀 ~ stan.on ~ error:", error);
  }
});
