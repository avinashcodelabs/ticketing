import { OrderStatus } from "@avinashcodelabs/common";
import mongoose, { Schema, model } from "mongoose";
import { Order } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    versionKey: "version",
  }
);

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this, // this === current Ticket
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};

ticketSchema.statics.findByEvent = async function (event) {
  const { id, version } = event;
  const ticket = await Ticket.findOne({
    _id: id,
    version: version - 1,
  });
  return ticket;
};

ticketSchema.plugin(updateIfCurrentPlugin);

const Ticket = model("Ticket", ticketSchema);

export { Ticket };
