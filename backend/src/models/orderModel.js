import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
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
          ref:"product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    name: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    total: { type: Number, required: true },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["placed", "shipped", "delivered", "pending", "cancelled"],
    },
    razorpayPaymentStatus: {
      type: String,
      enum: ["paid", "failed", "pending", "captured", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;




// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//       required: true,
//     },
//     items: [
//       {
//         productId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Cart",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],
//     date: {
//       type: Date,
//       default: Date.now,
//       required: true
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     address: {
//       type: String,
//       required: true,
//     },

//     paymentMethod: {
//       type: String,
//       required: true,
//       //   enum: ['razorpay', 'card', 'paypal'],
//     },
//     total: {
//       type: Number,
//       required: true
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Order = mongoose.model("Order", orderSchema);
// export default Order;
