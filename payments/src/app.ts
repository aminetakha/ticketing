import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@tkhtickets/common";
import { createChargeRouter } from "./routes/new";

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

app.use(createChargeRouter);

app.all("/*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
