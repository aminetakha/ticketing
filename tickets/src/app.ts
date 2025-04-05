import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@tkhtickets/common";
import { createTicketsRouter } from "./routes/new";
import { showTicketsRouter } from "./routes/show";
import { ticketsRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
app.use(createTicketsRouter);
app.use(showTicketsRouter);
app.use(ticketsRouter);
app.use(updateTicketRouter);

app.all("/*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
