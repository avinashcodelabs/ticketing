import { natsWrapper } from "./nats-wrapper";
import { OrderCreateListener } from "./events/listeners/order-create-listener";

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
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

    // start listening to nats streaming server..
    new OrderCreateListener(natsWrapper.client).listen();
  } catch (error) {
    console.error(error);
  }
};

start();
