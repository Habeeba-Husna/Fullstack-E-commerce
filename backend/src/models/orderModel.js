import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Cart",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      //   enum: ['razorpay', 'card', 'paypal'],
    },
    total: {
      type: Number,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
