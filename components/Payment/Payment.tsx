import React, { useState } from "react";

// Define the type for the payment request
interface CreatePaymentRequest {
  cardNumber: string;
  nameSurname: string;
  expDate: string;
  cvv: string;
  khaltiNameSurname?: string;  // Added this line
  khaltiEmail?: string;        // Added this line
}

const Payment: React.FC = () => {
  const [paymentInfos, setPaymentInfos] = useState<CreatePaymentRequest>({
    cardNumber: "",
    nameSurname: "",
    expDate: "",
    cvv: "",
    khaltiNameSurname: "",  // Initialize with empty string if needed
  });

  // Example use of position
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, selectionEnd } = event.target;
    let position = selectionEnd ?? 0; // Null check for selectionEnd

    setPaymentInfos({
      ...paymentInfos,
      [name]: value,
    });

    // Add more logic if necessary
    console.log("Cursor position: ", position);
  };

  const handlePaymentSubmit = () => {
    console.log(paymentInfos);

    // Additional logic to handle payment
  };

  // Removed unused variables 'onePrice', 'dateRange', 'dayDifference'

  return (
    <div className="payment-container">
      <h2>Payment Information</h2>

      <label htmlFor="nameSurname">Name and Surname</label>
      <input
        type="text"
        id="nameSurname"
        name="nameSurname"
        value={paymentInfos.nameSurname}
        onChange={handleInputChange}
      />

      <label htmlFor="cardNumber">Card Number</label>
      <input
        type="text"
        id="cardNumber"
        name="cardNumber"
        value={paymentInfos.cardNumber}
        onChange={handleInputChange}
      />

      <label htmlFor="expDate">Expiration Date</label>
      <input
        type="text"
        id="expDate"
        name="expDate"
        value={paymentInfos.expDate}
        onChange={handleInputChange}
      />

      <label htmlFor="cvv">CVV</label>
      <input
        type="text"
        id="cvv"
        name="cvv"
        value={paymentInfos.cvv}
        onChange={handleInputChange}
      />

      <label htmlFor="khaltiNameSurname">Khalti Name and Surname</label>
      <input
        type="text"
        id="khaltiNameSurname"
        name="khaltiNameSurname"
        value={paymentInfos.khaltiNameSurname || ""}
        onChange={handleInputChange}
      />

      <button onClick={handlePaymentSubmit}>Submit Payment</button>
    </div>
  );
};

export default Payment;
