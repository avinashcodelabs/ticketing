import mongoose from "mongoose";
import { randomBytes } from "crypto";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

// Connect to Mongo DB before starting the app server
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  console.log("JWT_KEY", process.env.JWT_KEY);
  console.log("MONGO_URI", process.env.MONGO_URI);

  try {
    await natsWrapper.connect(
      "ticketing",
      randomBytes(4).toString("hex"),
      "http://nats-srv:4222"
    );

    // To gracefully shutdown the nats streaming server
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI); // 'tickets' in the end is just a DB name, I want to create.
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("tickets service running on 3000");
  });
};

start();
