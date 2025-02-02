import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Divider, Modal, Notification, useToaster } from "rsuite";
import {
  useCreatePaymentMutation,
  useGetUserPaymentsQuery,
} from "../../src/store/features/paymentApiSlice/paymentApiSlice";
import { useCreateTourMutation } from "../../src/store/features/tourApiSlice/tourApiSlice";
import "./Payment.scss";

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
  const [cardType, setCardType] = useState<"visa" | "mastercard" | null>(null);
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
    if (payments && payments.length > 0) {
      setPaymentInfos({
        cardNumber: payments[0].cardNumber,
        nameSurname: payments[0].nameSurname,
        email: payments[0].email,
        expDate: payments[0].expDate,
        cvv: payments[0].cvv,
        khaltiNumber: payments[0].khaltiNumber,
      });
    }
  }, [payments]);

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
        await createTour({ date, person, nameSurname, email, ticket, location }).unwrap();
        await createPayment(paymentInfos).unwrap();
        setOpenPayment(false);
        navigate("/");
        toaster.push(<Notification>Payment Success!</Notification>, { placement: "topEnd" });
      } catch (error) {
        console.error(error);
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