import { apiSlice } from "../apiSlice/apiSlice";

// Define the base URL for the payment-related APIs
const PAYMENTS_URL = "/api/payments";

// Declare the types for the request body
interface CreatePaymentRequest {
  cardNumber: string;
  nameSurname: string;
  email: string;
  expDate: string;
  cvv: string;
  khaltiNumber: string;
}

interface DeletePaymentRequest {
  id: string;
}

// Define the Payment type to be used in your endpoints
interface Payment {
  id: string;
  cardNumber: string;
  nameSurname: string;
  email: string;
  expDate: string;
  cvv: string;
  khaltiNumber: string;
}

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to create a new payment
    createPayment: builder.mutation<Payment, CreatePaymentRequest>({
      query: (body) => ({
        url: `${PAYMENTS_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment"], // Invalidate cached payment data
    }),

    // Endpoint to fetch user's payments
    getUserPayments: builder.query<Payment[], void>({
      query: () => ({
        url: `${PAYMENTS_URL}`,
        method: "GET",
      }),
      providesTags: ["Payment"], // Cache the fetched payment data
    }),

    // Endpoint to delete a payment
    deletePayment: builder.mutation<void, DeletePaymentRequest>({
      query: ({ id }) => ({
        url: `${PAYMENTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"], // Invalidate cached payment data
    }),

    // Endpoint to initiate Khalti payment
    initiateKhaltiPayment: builder.mutation<any, CreatePaymentRequest>({
      query: (body) => ({
        url: "/api/khalti/payment/initiate", // Ensure this endpoint is available
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetUserPaymentsQuery,
  useDeletePaymentMutation,
  useInitiateKhaltiPaymentMutation,
} = paymentApiSlice;
