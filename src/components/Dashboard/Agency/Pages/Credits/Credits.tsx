import { useAppContext } from '@Context/App.context';
import httpServiceObj from '@Services/ApiHandler.service';
import { startRazorpayPayment } from '@Utils/RazorpayUtils';
import { getToastOptions } from '@Utils/Toast.utils';
import { Info, Square, TrendingUp } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import OrderDetailsModal from './modals/OrderDetailsModal';

export interface CreditsListApiResponse {
  data: CreditsList[];
  pagination: PaginationInfo;
}
export interface CreditsList {
  amountPerCv: number;
  createdAt: string;
  createdByUserId: string;
  id: string;
  isActiveForPurchase: boolean;
  totalAmount: number
  totalCvCount: number
  updatedAt: string;
}

export interface CreditedAndDebitedTransactionListApiResponse {
  data: CreditedAndDebitedTransactionList[];
  pagination: PaginationInfo;
}
export interface CreditedAndDebitedTransactionList {
  id: string;
  createdAt: string;
  updatedAt: string;
  agencyRegisteredEmail:string;
  agencyUserId:string;
  cvCount: number;
  amount: number;
  agencyCvRechargeOrderId: string; 
  cvUsed: number;
  agencyBulkJdId: string;
}
export interface BalanceCVCount {
  id: string;
  createdAt: string;
  updatedAt: string;
  agencyRegisteredEmail:string;
  agencyUserId:string;
  totalAvailableCvCount: number;
  totalUsedCvCount: number;
  totalAmountPaid: number; 
  lastRechargeDate: string;
  lastCvDeductionDate: string;
  totalRecharges:number;
  updatedByAgencyUserId:string;
}
export interface PaginationInfo {
  count: number;
  pageSize: number;
  lastKey: string;
}

const Credits = () => {
  const { userDetails } = useAppContext();
  const [selectedPlan, setSelectedPlan] = useState<CreditsList | null>(null);

  const [isCreditedTransactionListLoading,setIsCreditedTransactionListLoading] = useState<boolean>(false);
  const [creditedTransactionList,setCreditedTransactionList] = useState<CreditedAndDebitedTransactionList[]>([]);

  const [isDebitedTransactionListLoading,setIsDebitedTransactionListLoading] = useState<boolean>(false);
  const [debitedTransactionList,setDebitedTransactionList] = useState<CreditedAndDebitedTransactionList[]>([]);

  const [isBalanceCVCountListLoading,setIsBalanceCVCountListLoading] = useState<boolean>(false);
  const [balanceCVCountListAndWalletDetails,setBalanceCVCountListAndWalletDetails] = useState<BalanceCVCount | null>(null);

  const [isCreditsListLoading,setIsCreditsListLoading] = useState<boolean>(false);
  const [CreditsList,setCreditsList] = useState<CreditsList[]>([]);

  const [paymentID, setPaymentID] = useState<string>("");
  const [orderID, setOrderID] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [showOrderDetails, setShowOrderDetails] = useState<boolean>(false);
  const [switcher,setSwitcher] = useState<string>("credit");
  const [isSeeFullHistory,setIsSeeFullHistory] = useState<boolean>(false);
  const razorpayKey= import.meta.env.APP_RAZORPAY

  const getCreditsList = async () =>{
    setIsCreditsListLoading(true)
    try {
      const params = {
        sortOrder : "asc",
        pageSize:25,
      }
      const { response, error } = await httpServiceObj.get<CreditsListApiResponse>(`/agency-cv-recharge-package/`, true, params, false,"BASE");
      if(error){
        toast.error(error.message,getToastOptions({}))
        return
      }
      if(response) {
        setCreditsList(response.data)
      } 
    } catch (error) {
      console.log(error,"error in fetching credits list")
    } finally {
      setIsCreditsListLoading(false)
    }
  }

  const getCreditedTransactionsList = async () =>{
    if(!userDetails?.id){
      toast.error("No user details found please log in again",getToastOptions({}))
    }
    setIsCreditedTransactionListLoading(true)
    try {
      const params = {
        agencyUserId : userDetails?.id,
        pageSize:200,
      }
      const { response, error } = await httpServiceObj.get<CreditedAndDebitedTransactionListApiResponse>(`/agency-cv-credit-transaction/`, true, params, false,"BASE");
      if(error){
        toast.error(error.message,getToastOptions({}))
        return
      }
      if(response) setCreditedTransactionList(response.data)
    } catch (error) {
      console.log(error,"error in fetching credited transaction list")
    } finally {
      setIsCreditedTransactionListLoading(false)
    }
  }

  const getDebitedTransactionsList = async () =>{
    if(!userDetails?.id){
      toast.error("No user details found please log in again",getToastOptions({}))
    }
    setIsDebitedTransactionListLoading(true)
    try {
      const params = {
        agencyUserId : userDetails?.id,
        pageSize:200,
      }
      const { response, error } = await httpServiceObj.get<CreditedAndDebitedTransactionListApiResponse>(`/agency-cv-debit-transaction/`, true, params, false,"BASE");
      if(error){
        toast.error(error.message,getToastOptions({}))
        return
      }
      if(response) setDebitedTransactionList(response.data)
    } catch (error) {
      console.log(error,"error in fetching debited transaction list")
    } finally {
      setIsDebitedTransactionListLoading(false)
    }
  }

  const getBalanceCVCountAndWalletDetails = async () =>{
    if(!userDetails?.id){
      toast.error("No user details found please log in again",getToastOptions({}))
    }
    setIsBalanceCVCountListLoading(true)
    try {
      const { response, error } = await httpServiceObj.get<BalanceCVCount>(`/agency-cv-wallet/${userDetails?.id}`, true, {}, false,"BASE");
      if(error){
        if(error.message === "HTTP error! status: 404, message: "){
          setBalanceCVCountListAndWalletDetails(null) 
          return     
        }else{
          toast.error(error.message,getToastOptions({}))
          return
        }
      }
      if(response){
        setBalanceCVCountListAndWalletDetails(response)
      }
    } catch (error) {
      console.log(error,"error in fetching credits list")
    } finally {
      setIsBalanceCVCountListLoading(false)
    }
  }

  const createOrder = async (id:string, agencyCvRechargePackageId:string, paymentGatewayProvider:string) => {
    if(!id){
      toast.error("No user id found please login again",getToastOptions({}))
      return null
    }
    if(!agencyCvRechargePackageId){
      toast.error("No package id found please select a id",getToastOptions({}))
      return null
    }
    const payload ={
      agencyCvRechargePackageId,
      paymentGatewayProvider
    }
    try {
      const { response } = await httpServiceObj.post(`/agency-cv-recharge-order/create`, payload, true, {}, false, "BASE");
      return response
    } catch (error) {
      console.error("Error fetching subscription plan:", error);
      return null;
    }
  }

  const handleBuyNow = async () => {
    if(!userDetails){
      toast.error("No user details found please log in again")
      return
    }
    const createOrderResponse = await startRazorpayPayment({
      price: selectedPlan?.totalAmount ?? 0,
      userDetails:userDetails ?? undefined,
      razorpayKey,
      productContextId: selectedPlan?.id ?? "",
      createOrder: createOrder,
      onPaymentSuccess: async (paymentResponse) => {
        if (paymentResponse && createOrderResponse) {
          const payload = {
            paymentGatewayProvider: "RAZORPAY",
            paymentGatewayVerificationDetails: {
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            }
          }
          setPaymentID(paymentResponse.razorpay_payment_id)
          setOrderID(paymentResponse.razorpay_order_id)
          setAmount(selectedPlan?.totalAmount ?? 0)
          const {response, error} = await httpServiceObj.post(`/agency-cv-recharge-order/verify-payment`, payload, true, {}, false, "BASE");
          if(error){
            toast.error(error.message,getToastOptions({}))
            return
          }
          setShowOrderDetails(true)
        }
      },
      onPaymentFailure: (reason) => {
        toast.error("Payment was not completed.", getToastOptions({}));
      },
    });
  };

  const firstCall = async () =>{
    if (!userDetails?.id) return;
    getCreditsList()
    getCreditedTransactionsList()
    getDebitedTransactionsList()
    getBalanceCVCountAndWalletDetails()
  }
  useEffect(() => {
    firstCall()
  }, [userDetails?.id])

  const isLoading = switcher === "credit" ? isCreditedTransactionListLoading : isDebitedTransactionListLoading;
  const fullTransactions = switcher === "credit" ? creditedTransactionList : debitedTransactionList;
  const splittedTransactions = fullTransactions.slice(0,3)
  const transactions = isSeeFullHistory ? fullTransactions : splittedTransactions

  return (
    <div className='flex flex-col lg:flex-row justify-center items-center gap-5 m-5'>
      {/* credits section left side */}
      <div className='flex-1 min-h-[30em] w-full rounded-xl shadow-xl border-1 border-gray-300 bg-white'>
        <h1 className='text-2xl font-semibold p-8'>Recharge your wallet now</h1>

      <div className="max-w-lg w-full mx-auto">
        <p className='text-left text-xs flex flex-row justify-start items-center gap-2 px-6'>
          Choose cv package 
          <span className='text-gray-400'>
            <Info className='h-3 w-auto'
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Select how many CV credits you want to purchase."
            />
          </span>
        </p>

        <div className='flex justify-center items-center text-center flex-wrap gap-2 mt-6 px-6'>
            {isCreditsListLoading ? (
              <p className="text-center text-gray-400">Loading packages...</p>
            ) : CreditsList.length === 0 ? (
              <p className="text-center text-gray-400">No package found</p>
            ) : (
          CreditsList.map((cv, index) => {
          const isSelected = selectedPlan?.id === cv.id;

          return (
            <div key={index} className='flex justify-start'>
              <span
                onClick={() => setSelectedPlan(cv)}
                className={`cursor-pointer border border-gray-500 max-w-[3em] min-w-[3em] max-h-[4em] min-h-[4em] rounded-lg px-[3rem] py-3 flex justify-center items-center text-xs font-semibold text-nowrap
                  ${isSelected ? 'bg-blue-100 text-blue-600 border-blue-700' : null}
                `}
              >
                {cv.totalCvCount} CV
              </span>
            </div>
              );
            })
          )}
        </div>
      </div>
      
          <div className='flex flex-row gap-3 justify-center items-center mt-4 px-8'>
            <div className='text-left flex-1'>
                <label htmlFor="rate" className="inline-flex items-center gap-1">
                  Rate <span className="text-gray-400">
                    <Info 
                    className='h-3 w-auto'
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Amount per cv"
                    />
                    </span>
                </label>
                <input 
                  id="total"
                  type="text"
                  className="input_primary auth_input bg-gray-200 text-black h-10"
                  disabled={true}
                  value={selectedPlan ? `${selectedPlan.amountPerCv}₹ /CV` : '₹0'}
                />
            </div>
            <div className='text-left flex-2'>
                <label htmlFor="total" className="inline-flex items-center gap-1">
                  Total 
                  <span className="text-gray-400">
                    <Info 
                    className='h-3 w-auto'
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Total amount to be charged"
                    />
                  </span>
                </label>
                <input 
                  id="total"
                  type="text"
                  className="input_primary auth_input bg-gray-200 text-black h-10"
                  disabled={true}
                  value={selectedPlan ? `₹${selectedPlan.totalAmount}` : '₹0'}
                />                 
            </div>
          </div>

          <div>
            <button 
            className='bg-gradient-to-t from-blue-500 to-cyan-300 px-6 py-2 rounded-xl mt-6 mb-2 shadow-xl text-white font-semibold text-sm'
            onClick={handleBuyNow}>
              Purchase
            </button>
          </div>
      </div>


      {/* transaction section right side */}
      <div className='flex-1 min-h-[30em] w-full flex flex-col gap-3 rounded-xl'>
        <div className='flex flex-row justify-end items-center'>
          <div
            className="rounded-xl w-full p-[3px] sm:w-1/2"
            style={{
              background: 'linear-gradient(to bottom, blue, cyan)',
            }}
          >
            <div className='rounded-lg p-3 bg-blue-800 flex flex-row gap-5 justify-around items-center'>
              <div className="text-white">
                Balance
              </div>
              <div className='text-nowrap bg-white rounded-lg px-4 font-semibold text-blue-500'>
                {balanceCVCountListAndWalletDetails?.totalAvailableCvCount
                ? `${balanceCVCountListAndWalletDetails?.totalAvailableCvCount} cv`
                : "0 cv"}
              </div>
            </div>
          </div>
        </div>

    <div className='flex-1 rounded-xl flex flex-col justify-between shadow-xl bg-white'>
      {/* Header */}
    <div className='flex flex-col px-4 pt-2 space-y-1'>
      {/* Top row */}
      <div className='flex justify-between items-center'>
        <div className='flex flex-row justify-center items-center gap-2'>
          <span className='bg-cyan-300 text-cyan-300 text-lg rounded-[50%] h-2 w-2 border-cyan-100'></span>
          <span className='font-semibold text-sm'>{switcher === "credit" ? "Payment Transactions" : "Debit History"}</span>
          
          <div className="inline-flex bg-white rounded-2xl p-1 shadow-md border">
            <button
              onClick={() => setSwitcher("credit")}
              className={`px-3 py-1 rounded-xl text-sm font-semibold transition-all duration-300
                ${
                  switcher === "credit"
                    ? "bg-blue-500 text-white shadow"
                    : "text-gray-400 hover:text-blue-500"
                }
              `}
            >
              Credit
            </button>

            <button
              onClick={() => setSwitcher("debit")}
              className={`px-3 py-1 rounded-xl text-sm font-semibold transition-all duration-300
                ${
                  switcher === "debit"
                    ? "bg-blue-500 text-white shadow"
                    : "text-gray-400 hover:text-blue-500"
                }
              `}
            >
              Debit
            </button>
          </div>

        </div>
        {/* <span className='text-gray-400 text-2xl'>...</span> */}
      </div>

      {/* Second row */}
      <div className='flex justify-start items-center gap-2 pt-2'>
        <span className='font-semibold text-sm'>                
          {balanceCVCountListAndWalletDetails?.totalAmountPaid
            ? `₹${Number(balanceCVCountListAndWalletDetails.totalAmountPaid).toLocaleString("en-IN")}`
            : "₹0"}
        </span>
        <span className='text-gray-400'>|</span>
        <select className='text-sm border rounded px-2 py-1'>
          <option>This month</option>
        </select>
      </div>
    </div>


      {/* Scrollable middle section */}
      <div className='middle overflow-y-auto max-h-[15em] px-4 py-2 space-y-2'>
      {isLoading ? (
        <p className="text-center text-gray-400 py-6">
          Loading transactions...
        </p>
        ) : fullTransactions && fullTransactions.length > 0 ? 
        (transactions?.map((tx, index) => (
          <div
            key={index}
            className='border rounded-md p-2 flex justify-between items-center text-sm shadow-lg'
          >
            <div className='flex flex-row text-start gap-2 justify-center items-center'>
              <div className='border rounded-[50%] bg-blue-100'>
                <Square className='w-5 h-auto m-2 text-blue-300'/>
              </div>             
              <div className='flex flex-col'>
                <span className='font-medium'>{tx.cvCount ? tx.cvCount : `-${tx.cvUsed}` } CV</span>
                <span className='text-xs text-gray-500'>{tx.cvCount 
                ? `Added ${tx.cvCount} cv in wallet`
                : `Deducted ${tx.cvUsed} cv from wallet`}</span>
                <span className='text-xs text-gray-500'>{new Date(tx.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className='text-black font-semibold'>{tx.amount ? `₹${tx.amount}` : ""}</div>
            <div className='border rounded-[50%] bg-blue-100'>
              <TrendingUp className='w-3 h-auto m-1 text-blue-300'/>
            </div>
          </div>
        )))
        : (
          <p className="text-center text-gray-400 py-6">
            No transaction found
          </p>
        )
      }
      </div>

      {/* Footer */}
      <div className='pb-4 '>
        <span 
        className='text-sky-400 underline capitalize text-sm cursor-pointer'
          onClick={()=>setIsSeeFullHistory(prev=>!prev)}>
          {isSeeFullHistory ? "hide full history" :"see full history"}
        </span>
      </div>
    </div>

      </div>

        <OrderDetailsModal
          show={showOrderDetails}
          amount={amount}
          paymentID={paymentID}
          orderID={orderID} 
          onRefresh={()=>firstCall()}
          onClose={() => {
            setShowOrderDetails(false)
            setPaymentID("")
            setOrderID("")
            setAmount(0)
            setSelectedPlan(null)
            setBalanceCVCountListAndWalletDetails(null)
            setCreditsList([])
          }} 
        />
    </div>
  )
}

export default Credits