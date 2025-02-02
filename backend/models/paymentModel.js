const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    cardNumber: {
      type: String,
      required: function () {
        return !this.khaltiNumber; // cardNumber is required if khaltiNumber is not provided
      },
    },
    nameSurname: {
      type: String,
      required: true, // Required for both payment methods
    },
    email: {
      type: String,
      required: true, // Required for both payment methods
    },
    expDate: {
      type: String,
      required: function () {
        return !!this.cardNumber; // Only required if cardNumber is provided
      },
    },
    cvv: {
      type: String,
      required: function () {
        return !!this.cardNumber; // Only required if cardNumber is provided
      },
    },
    khaltiNumber: {
      type: String,
      required: function () {
        return !this.cardNumber; // khaltiNumber is required if cardNumber is not provided
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
