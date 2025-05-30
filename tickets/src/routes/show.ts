import express, { Request, Response } from "express";
import { Ticket } from "../models/Ticket";
import { NotFoundError } from "@tkhtickets/common";

const router = express.Router();

router.get("/api/tickets/:id", async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  res.status(200).send(ticket);
});

export { router as showTicketsRouter };
