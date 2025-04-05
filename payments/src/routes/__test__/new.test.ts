import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import mongoose from "mongoose";
import { OrderStatus } from "@tkhtickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order the does not exist", async () => {
  return request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({
      token: "sdsddd",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();

  return request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({ token: "dojdodwwd", orderId: order.id })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = global.signup(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Cancelled,
    userId: userId,
    version: 0,
  });

  await order.save();

  return request(app)
    .post("/api/payments")
    .set("Cookie", user)
    .send({ token: "dojdodwwd", orderId: order.id })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = global.signup(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: userId,
    version: 0,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", user)
    .send({ token: "tok_visa", orderId: order.id })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
  });

  expect(payment).not.toBeNull();
});
