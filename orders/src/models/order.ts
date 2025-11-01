import { OrderStatus } from "@avinashcodelabs/common";
import mongoose, { Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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

orderSchema.plugin(updateIfCurrentPlugin);

const Order = model("Order", orderSchema);

export { Order };
