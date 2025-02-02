import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Divider, Modal, Notification, useToaster } from "rsuite";
import { useCreatePaymentMutation, useGetUserPaymentsQuery } from "../../src/store/features/paymentApiSlice/paymentApiSlice";
import { useCreateTourMutation } from "../../src/store/features/tourApiSlice/tourApiSlice";
import "./Payment.scss";

// Use the Khalti secret key from environment variables
const secretKey = process.env.REACT_APP_KHALTI_SECRET_KEY;

type Props = {
  person: number;
  date: Date;
  nameSurname: string;
  email: string;
  ticket: string;
  onePrice: number;
  openPayment: boolean;
  setOpenPayment: (open: boolean) => void;
  location: string;
};

const Payment = ({
  person,
  date,
  nameSurname,
  email,
  ticket,
  onePrice,
  openPayment,
  setOpenPayment,
  location,
}: Props) => {
  const toaster = useToaster();
  const navigate = useNavigate();
  const [cardType, setCardType] = useState<"visa" | "mastercard" | null>(null); // State to store card type
  const [selectedSection, setSelectedSection] = useState<"credit" | "khalti" | null>("credit");
  const [paymentInfos, setPaymentInfos] = useState({
    cardNumber: "",
    nameSurname: "",
    email: "",
    expDate: "",
    cvv: "",
    khaltiNumber: "",
  });

  const [createTour, { isLoading }] = useCreateTourMutation();
  const [createPayment] = useCreatePaymentMutation();
  const { data: payments } = useGetUserPaymentsQuery();

  useEffect(() => {
    if (payments && payments.length > 0 && !paymentInfos.cardNumber) {
      setPaymentInfos({
        cardNumber: payments[0].cardNumber,
        nameSurname: payments[0].nameSurname,
        email: payments[0].email,
        expDate: payments[0].expDate,
        cvv: payments[0].cvv,
        khaltiNumber: payments[0].khaltiNumber,
      });
    }
  }, [payments, paymentInfos]);

  const checkCardType = (number: string) => {
    if (/^4/.test(number)) {
      setCardType("visa");
    } else if (/^5[1-5]/.test(number)) {
      setCardType("mastercard");
    } else {
      setCardType(null);
    }
  };

  const handlePaymentSubmit = async () => {
    if (
      (paymentInfos.cardNumber &&
        paymentInfos.cvv &&
        paymentInfos.email &&
        paymentInfos.expDate &&
        paymentInfos.nameSurname) ||
      (paymentInfos.khaltiNumber)
    ) {
      try {
        // First create the tour
        await createTour({ date, person, nameSurname, email, ticket, location }).unwrap();

        if (selectedSection === "khalti") {
          // Khalti Payment
          const response = await fetch("https://khalti.com/api/v2/epayment/initiate/", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${secretKey}`, // Use secret key from environment variable
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              return_url: "https://testing.com/",
              website_url: "https://testing.com/",
              amount: `${onePrice}`,
              ttl: 1000, // Time to live in seconds
              bank: "your-bank-identifier",
              modes: ["MOBILE_BANKING"],
              purchase_order_id: "tour_01", // Unique purchase order ID
              customer_info: {
                name: nameSurname,
                email,
                phone: paymentInfos.khaltiNumber,
              },
              amount_breakdown: [
                {
                  label: "Tour Payment",
                  amount: `${onePrice}`,
                },
              ],
              product_details: [
                {
                  identity: "tour_1",
                  name: "Tour Package",
                  total_price: onePrice,
                  quantity: 1,
                  unit_price: onePrice,
                },
              ],
            }),
          });
          const data = await response.json();
          if (data && data.pidx) {
            await createPayment({
              ...paymentInfos,
              khaltiNumber: paymentInfos.khaltiNumber,
            }).unwrap();
            setOpenPayment(false);
            navigate("/");
            toaster.push(<Notification>Payment Success!</Notification>, { placement: "topEnd" });
          } else {
            toaster.push(<Notification>Payment Failed!</Notification>, { placement: "topEnd" });
          }
        } else {
          // Credit Card Payment
          await createPayment(paymentInfos).unwrap();
          setOpenPayment(false);
          navigate("/");
          toaster.push(<Notification>Payment Success!</Notification>, { placement: "topEnd" });
        }
      } catch (error) {
        console.error(error);
        toaster.push(<Notification>Payment Error! Please try again.</Notification>, { placement: "topEnd" });
      }
    } else {
      toaster.push(<Notification>Payment Error! Please fill in all fields.</Notification>, { placement: "topEnd" });
    }
  };

  return (
    <Modal open={openPayment} size="lg" onClose={() => setOpenPayment(false)}>
      <Modal.Header>
        <Modal.Title>Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="payment-options">
          <div className="credit-card">
            <input
              type="radio"
              name="paymentOption"
              checked={selectedSection === "credit"}
              onChange={() => setSelectedSection("credit")}
            />
            <label>Credit / Debit Card</label>
            {selectedSection === "credit" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Divider />
                <input
                  type="text"
                  placeholder="Card Number"
                  onChange={(e) => {
                    checkCardType(e.target.value);
                    setPaymentInfos({ ...paymentInfos, cardNumber: e.target.value });
                  }}
                />
                {/* Display the card type if available */}
                {cardType && <p>Card Type: {cardType === "visa" ? "Visa" : "MasterCard"}</p>}
              </motion.div>
            )}
          </div>
          <div className="khalti">
            <input
              type="radio"
              name="paymentOption"
              checked={selectedSection === "khalti"}
              onChange={() => setSelectedSection("khalti")}
            />
            <label>Khalti</label>
            {selectedSection === "khalti" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Divider />
                <input
                  type="text"
                  placeholder="Khalti Number"
                  onChange={(e) => setPaymentInfos({ ...paymentInfos, khaltiNumber: e.target.value })}
                />
              </motion.div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handlePaymentSubmit} loading={isLoading}>Pay Now</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Payment;
