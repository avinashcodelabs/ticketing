import mongoose from "mongoose";
import { app } from "./app";

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
    await mongoose.connect(process.env.MONGO_URI); // 'auth' in the end is just a DB name, I want to create.
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("auth service running on 3000..");
  });
};

start();
