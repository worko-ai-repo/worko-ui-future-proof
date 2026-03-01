import { toast } from "react-toastify";
import { getToastOptions } from "./Toast.utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UserDetails {
  name?: string;
  email?: string;
  number?: string;
  userId?: string;
  id?:string;
}

interface ProductPayload {
  price: number;
  userDetails?: UserDetails;
  razorpayKey: string;
  productContextId:string;
  createOrder: (id: string, productContextId:string, paymentGatewayProvider:string) => Promise<any>;
  onPaymentSuccess: (response: any) => void;
  onPaymentFailure: (response: any) => void;
}

export async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function startRazorpayPayment({
  price,
  userDetails,
  razorpayKey,
  productContextId,
  createOrder,
  onPaymentSuccess,
  onPaymentFailure,
}: ProductPayload) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    toast.error("Razorpay SDK failed to load. Please check internet connection", getToastOptions({}));
    return;
  }

  try {
    const response = await createOrder(userDetails?.id ?? "", productContextId, "RAZORPAY");
    if(!response){
      toast.error("Order creation failed", getToastOptions({}));
      return;
    }
    const orderId = response.paymentGatewayOrderId;

    const options = {
      key: razorpayKey,
      amount: price * 100, //in paisa
      currency: "INR",
      name: "Worko Ai",
      // description: `The ${name} subscription plan, priced at ₹${price}`,
      order_id: orderId,
      prefill: {
        name: userDetails?.name,
        email: userDetails?.email,
        contact: userDetails?.number,
      },
      theme: {
        color: "#3399cc",
      },
      handler: function (response: any) {
        // console.log("Payment success", response);
        onPaymentSuccess(response);
      },
      modal: {
        ondismiss: function () {
        //   console.log("Payment popup closed");
          onPaymentFailure?.("User cancelled the payment");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    return response;
  } catch (error) {
    console.error("Order creation or Razorpay init failed", error);
    toast.error("Something went wrong while processing the payment. Please try again.", getToastOptions({}));
    onPaymentFailure(error);
  }
}
