import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signup: (id?: string) => string[];
}

jest.mock("../nats-wrapper");

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signup = (id?: string) => {
  // build a jwt payload { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "user@test.com",
  };
  // Create the JWT
  const createdToken = jwt.sign(payload, process.env.JWT_KEY!);
  // Build the session object { jwt: MY_JWT }
  const sessionObject = { jwt: createdToken };
  // Take JSON and encode it as base64
  const base64 = Buffer.from(JSON.stringify(sessionObject)).toString("base64");
  // return a string thats a cookie with encoded data
  return [`session=${base64}`];
};
