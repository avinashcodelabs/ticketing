import { OrderStatus } from "@avinashcodelabs/common";
import mongoose, { Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const orderSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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
