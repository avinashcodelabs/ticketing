import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreateListener } from "./events/listeners/ticket-create-listener";
import { TicketUpdateListener } from "./events/listeners/ticket-update-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";

// Connect to Mongo DB before starting the app server
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  console.log("JWT_KEY", process.env.JWT_KEY);
  console.log("MONGO_URI", process.env.MONGO_URI);
  console.log("NATS_CLIENT_ID", process.env.NATS_CLIENT_ID);
  console.log("NATS_URL", process.env.NATS_URL);
  console.log("NATS_CLUSTER_ID", process.env.NATS_CLUSTER_ID);

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    // To gracefully shutdown the nats streaming server
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    // start listening to nats streaming server
    new TicketCreateListener(natsWrapper.client).listen();
    new TicketUpdateListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("orders service running on 3000");
  });
};

start();
