import express from "express";
import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@avinashcodelabs/common";
// stores the user session data in cookie at client. I am storing this at client so, not one only
// microservice(server) stores the data. so same client session data available to all microservices.
// Data consistency
import cookieSession from "cookie-session";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";
import { createOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";

const app = express();

// since we proxy all requests through load-balancer/ingress nginx controller to express pod/container
// we need to tell express that, it's normal and you can trust this proxy mechanism
app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded());
app.use(
  cookieSession({
    // By default cookie signs(encrypts) the content it holds, we want to disable this,
    // because whatever node.js/express algorithm uses to encrypt it could differ,
    // it when other microservices tries to read in if it's written in different framework like GO, or Java Spring.
    // Anyway JWT we store it in cookie, already tamper-resistant (encrypted)
    signed: false,
    secure: process.env.NODE_ENV !== "test", // send the cookie, only if it is https. on http it does'nt work
  })
);

app.use(currentUser);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);
app.use(createOrderRouter);
app.use(showOrderRouter);

// Order of middleware matters here.
// NotFoundError should come after all the valid routes and just before errorHandler,
// in order to handle the errors thrown by NotFoundError.
app.all("/*splat", () => {
  // "*" express4 and "/*splat" in express5
  throw new NotFoundError();
});

app.use(errorHandler);

// Application/server will start at index.js file
export { app };
