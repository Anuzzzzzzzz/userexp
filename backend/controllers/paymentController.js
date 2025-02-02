const asyncHandler = require("express-async-handler");
const Payment = require("../models/paymentModel");

// Create a payment
const createPayment = asyncHandler(async (req, res) => {
  const { cardNumber, nameSurname, email, expDate, cvv, khaltiNumber } =
    req.body;

  // Ensure the required fields are provided
  if (
    !nameSurname ||
    !email ||
    (!cardNumber && !khaltiNumber) ||
    !expDate ||
    !cvv
  ) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  // Check if card number follows Visa or MasterCard pattern (for card payments)
  let cardType = null;
  if (cardNumber) {
    if (/^4/.test(cardNumber)) {
      cardType = "visa";
    } else if (/^5[1-5]/.test(cardNumber)) {
      cardType = "mastercard";
    }
  }

  // Create a new payment entry
  const payment = new Payment({
    cardNumber,
    nameSurname,
    email,
    expDate,
    cvv,
    khaltiNumber,
    cardType,
    user: req.user._id,
  });

  // Save the payment and return the response
  const createdPayment = await payment.save();
  res.status(201).json(createdPayment);
});

// Get all payments for a user
const getUserPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id });
  res.json(payments);
});

// Delete a payment
const deletePayment = asyncHandler(async (req, res) => {
  const paymentId = req.params.id;

  // Find the payment by ID
  const payment = await Payment.findById(paymentId);

  if (payment) {
    // Check if the user is authorized to delete the payment
    if (payment.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized");
    }

    // Delete the payment
    await Payment.deleteOne({ _id: paymentId });
    res.json({ message: "Payment removed" });
  } else {
    res.status(404);
    throw new Error("Payment not found");
  }
});

module.exports = { createPayment, getUserPayments, deletePayment };
