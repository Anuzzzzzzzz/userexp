import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCcMastercard, FaCcVisa } from "react-icons/fa";
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
  const [saveCard, setSaveCard] = useState(false);
  const [selectedSection, setSelectedSection] = useState<"credit" | "Khalti" | null>("credit");
  const [paymentInfos, setPaymentInfos] = useState<{
    cardNumber: string;
    nameSurname: string;
    email: string;
    expDate: string;
    cvv: string;
    khaltiNameSurname: string;
    khaltiEmail: string;
  }>({
    cardNumber: "",
    nameSurname: "",
    email: "",
    expDate: "",
    cvv: "",
    khaltiNameSurname: "",
    khaltiEmail: "",
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
        khaltiNameSurname: payments[0].khaltiNameSurname,
        khaltiEmail: payments[0].khaltiEmail,
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

  const parsedDates = JSON.parse(JSON.stringify(date));
  const formattedDates = parsedDates.map((dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  });

  const dateRange = formattedDates.join(" - ");
  const startDate = new Date(formattedDates[0]);
  const endDate = new Date(formattedDates[1]);

  const timeDifference = endDate.getTime() - startDate.getTime();
  const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

  function displayEmailErrorNotification() {
    toaster.push(
      <Notification type="error" header="Reservation Error">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h6>Please enter a valid email.</h6>
        </div>
      </Notification>,
      {
        placement: "topEnd",
        duration: 3000,
      }
    );
  }

  const handlePaymentSubmit = async () => {
    if (
      (paymentInfos.cardNumber &&
        paymentInfos.cvv &&
        paymentInfos.email &&
        paymentInfos.expDate &&
        paymentInfos.nameSurname) ||
      (paymentInfos.khaltiEmail && paymentInfos.khaltiNameSurname)
    ) {
      const isValidEmail = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
      if (
        selectedSection === "credit" &&
        !isValidEmail.test(paymentInfos.email)
      ) {
        displayEmailErrorNotification();
        return;
      } else if (
        selectedSection === "Khalti" &&
        !isValidEmail.test(paymentInfos.khaltiEmail)
      ) {
        displayEmailErrorNotification();
        return;
      }
      try {
        const resTour = await createTour({
          date,
          person,
          nameSurname,
          email,
          ticket,
          location,
        }).unwrap();
        if (saveCard) {
          const resPayment = await createPayment({
            cardNumber: paymentInfos.cardNumber,
            nameSurname: paymentInfos.nameSurname,
            email: paymentInfos.email,
            expDate: paymentInfos.expDate,
            cvv: paymentInfos.cvv,
            khaltiNameSurname: paymentInfos.khaltiNameSurname,
            khaltiEmail: paymentInfos.khaltiEmail,
          }).unwrap();
          console.log("resPayment", resPayment);
        }
        console.log("resTour", resTour);
        setOpenPayment(false);
        setPaymentInfos({
          cardNumber: "",
          nameSurname: "",
          email: "",
          expDate: "",
          cvv: "",
          khaltiNameSurname: "",
          khaltiEmail: "",
        });
        navigate("/");
        return toaster.push(
          <Notification>
            <div className="notification-content">
              <h5>Payment Success !</h5>
              <p>Thank you for your payment 🎉</p>
            </div>
          </Notification>,
          {
            placement: "topEnd",
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      return toaster.push(
        <Notification>
          <div className="notification-content">
            <h5>Payment Error !</h5>
            <p>Please fill in the requested information ⚠️</p>
          </div>
        </Notification>,
        {
          placement: "topEnd",
          duration: 3000,
        }
      );
    }
  };

  return (
    <Modal
      overflow={false}
      open={openPayment}
      size="lg"
      onClose={() => setOpenPayment(false)}
    >
      <Modal.Header>
        <Modal.Title>Payment</Modal.Title>
        <p>Please fill in the requested information</p>
      </Modal.Header>
      <Modal.Body>
        <div className="left-card">
          <div className="title">
            <h4>Payment Options</h4>
            <p>𖤘 Secure server</p>
          </div>
          <div className="payment-areas">
            <div className="creditCard">
              <div className="select-credit">
                <div className="left">
                  <input
                    defaultChecked
                    type="radio"
                    name="paymentOption"
                    value="credit"
                    id="paymentOption"
                    onChange={() => setSelectedSection("credit")}
                  />
                  <label htmlFor="paymentOption">Credit / Debit Card</label>
                  <p>Secure transfer using your bank account</p>
                </div>
                <div className="right">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/2560px-MasterCard_Logo.svg.png"
                    alt=""
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1024px-Visa_Inc._logo.svg.png"
                    alt=""
                  />
                </div>
              </div>
              {selectedSection === "credit" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inputs"
                >
                  <Divider />
                  <div className="row">
                    <div className="col">
                      <label htmlFor="cardNumber">Card Number</label>
                      <div className="credit-card-input">
                        {cardType === "visa" ? (
                          <i>
                            <FaCcVisa size={22} />
                          </i>
                        ) : cardType === "mastercard" ? (
                          <i>
                            <FaCcMastercard size={22} />
                          </i>
                        ) : null}
                        <input
                          type="text"
                          id="cardNumber"
                          value={paymentInfos.cardNumber}
                          maxLength={19}
                          onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            let position = target.selectionEnd;
                            const originalValue = target.value;
                            const regex = new RegExp(/(\d{4})/g);
                            const onlyNumbers = originalValue.replace(
                              /[^\d]/g,
                              ""
                            );
                            const formatted = onlyNumbers
                              .replace(regex, "$1 ")
                              .trim();
                            target.value = formatted;
                            checkCardType(target.value);
                            if (position > target.value.length) {
                              position = target.value.length;
                            }
                            target.setSelectionRange(position, position);
                          }}
                          onChange={(e) => {
                            setPaymentInfos({
                              ...paymentInfos,
                              cardNumber: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <label htmlFor="nameSurname">Name Surname</label>
                      <input
                        type="text"
                        id="nameSurname"
                        value={paymentInfos.nameSurname}
                        onChange={(e) => {
                          setPaymentInfos({
                            ...paymentInfos,
                            nameSurname: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="expDate">Expiration Date</label>
                      <input
                        type="text"
                        id="expDate"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={paymentInfos.expDate}
                        onInput={(e) => {
                          const target = e.target as HTMLInputElement;
                          let position = target.selectionEnd;
                          const originalValue = target.value;
                          const regex = new RegExp(/(\d{2})/g);
                          const onlyNumbers = originalValue.replace(
                            /[^\d]/g,
                            ""
                          );
                          const formatted = onlyNumbers
                            .replace(regex, "$1/")
                            .trim();
                          target.value = formatted;
                          if (position > target.value.length) {
                            position = target.value.length;
                          }
                          target.setSelectionRange(position, position);
                        }}
                        onChange={(e) => {
                          setPaymentInfos({
                            ...paymentInfos,
                            expDate: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        maxLength={3}
                        value={paymentInfos.cvv}
                        onChange={(e) => {
                          setPaymentInfos({
                            ...paymentInfos,
                            cvv: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <Divider />
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id="saveCard"
                      checked={saveCard}
                      onChange={() => setSaveCard(!saveCard)}
                    />
                    <label htmlFor="saveCard">
                      Save Card Information for Future Payments
                    </label>
                  </div>
                </motion.div>
              )}
            </div>
            <div className="Khalti">
              <div className="select-Khalti">
                <div className="left">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="Khalti"
                    id="KhaltiOption"
                    onChange={() => setSelectedSection("Khalti")}
                  />
                  <label htmlFor="KhaltiOption">Khalti</label>
                  <p>Secure transfer using your Khalti account</p>
                </div>
              </div>
              {selectedSection === "Khalti" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inputs"
                >
                  <Divider />
                  <div className="row">
                    <div className="col">
                      <label htmlFor="khaltiNameSurname">Name Surname</label>
                      <input
                        type="text"
                        id="khaltiNameSurname"
                        value={paymentInfos.khaltiNameSurname}
                        onChange={(e) => {
                          setPaymentInfos({
                            ...paymentInfos,
                            khaltiNameSurname: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="khaltiEmail">Email</label>
                      <input
                        type="email"
                        id="khaltiEmail"
                        value={paymentInfos.khaltiEmail}
                        onChange={(e) => {
                          setPaymentInfos({
                            ...paymentInfos,
                            khaltiEmail: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          appearance="primary"
          onClick={handlePaymentSubmit}
          loading={isLoading}
        >
          Pay Now
        </Button>
        <Button onClick={() => setOpenPayment(false)}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Payment;
