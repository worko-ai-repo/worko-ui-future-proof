import { FC, useEffect, useState } from "react";

interface OrderDetailsModalProps {
  show: boolean;
  amount:number;
  paymentID?:string;
  orderID?:string;
  onRefresh:(()=>void);
  onClose: () => void;
}

const OrderDetailsModal: FC<OrderDetailsModalProps> = ({
  show,
  amount,
  paymentID,
  orderID,
  onRefresh,
  onClose,
}) => {

    const [visible, setVisible] = useState(false);
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
      if (show) {
        setVisible(true);
        const timer = setTimeout(() => setIsAnimatingIn(true), 10);
        return () => clearTimeout(timer);
      } else {
        setIsAnimatingIn(false);
        const timer = setTimeout(() => setVisible(false), 300);
        return () => clearTimeout(timer);
      }
    }, [show]);

const handleClose = () => {
  setIsAnimatingIn(false);
  setTimeout(() => {
    setVisible(false);
    onClose();  
    onRefresh();
  }, 300);
};

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-end transition-opacity duration-300 ease-in-out ${
        isAnimatingIn ? "bg-black bg-opacity-50" : "bg-opacity-0 bg-black"
      } ${visible ? "visible" : "invisible"}`}>
      <div
        className={`bg-white rounded-l-lg p-6 w-auto max-w-3xl relative transform transition-transform duration-300 ease-in-out self-auto max-h-[80vh] overflow-y-auto ${
          isAnimatingIn ? "translate-x-0" : "translate-x-full"
        }`}>
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-left">Payment Complete</h2>
        <h3 className="text-xl font-semibold mb-4 text-left">Your Payment was successfull</h3>
        <div className="bg-gray-200 rounded-xl p-4">
          <h1 className="text-lg font-semibold text-left mb-3">
            <span className="text-blue-600">Here's your order summary:</span>
          </h1>

          <div className="space-y-3">
            <div className="border rounded-lg bg-white text-sm p-3">
              <span className="font-medium text-gray-600">Amount:</span> ₹{amount}
            </div>
            <div className="border rounded-lg bg-white text-sm p-3">
              <span className="font-medium text-gray-600">Transaction ID:</span> {paymentID}
            </div>
            <div className="border rounded-lg bg-white text-sm p-3">
              <span className="font-medium text-gray-600">Order ID:</span> {orderID}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
