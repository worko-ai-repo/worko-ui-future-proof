import { logo_text } from "@AssetsFolder/assets";
import TermsAndConditionsAgency from "./TermsAndConditionsAgency";
import MessageModal from "@Components/Modals/MessageModal";
import MessageModalTermsAndCondidtions from "@Components/Modals/MessageModalTermsAndCondidtions";
import CognitoServiceObj from "@Utils/Cognito.utils";
import countryCodes from "@Utils/CountryCodes.utils";
import { validationRules } from "@Utils/FormValidator.utils";
import { getToastOptions } from "@Utils/Toast.utils";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const AgencySignupForm = ({
  inviteData,
  // handleFormSubmit,
  handleSendOtp,
  handleVerifyOtp,
}: {
  inviteData: any;
  // handleFormSubmit: (data: any) => void;
  handleSendOtp: (data: any) => Promise<boolean>;
  handleVerifyOtp: (email: string, otp: string, password: string) => Promise<any>;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      agencyName: "",
      password: "",
      phoneNumberDetails: {
        countryCode: "+91",
        phoneNumber: "",
      },
      confirmPassword: "",
      termsAndConditions: false,
      otp: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [ViewTerms, setViewTerms] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  // Populate form with inviteData when available
  useEffect(() => {
    if (inviteData) {
      let corporateUserType;
      //remove corporate- from accesstype
      // corporateUserType = inviteData.corporateUserType.replace("corporate-", "");

      setValue("name", `${inviteData.name}`);
      setValue("email", inviteData.email);
      setValue("agencyName", inviteData.agencyName);
      const resolvedCountryCode =
        inviteData?.phoneNumberDetails?.countryCode ||
        (inviteData?.phoneCountryCode ? `+${inviteData.phoneCountryCode}` : undefined) ||
        inviteData?.countryCode ||
        "+91";
      const resolvedPhoneNumber =
        inviteData?.phoneNumberDetails?.number ||
        inviteData?.number?.toString?.() ||
        "";
      setValue("phoneNumberDetails.countryCode", resolvedCountryCode);
      setValue("phoneNumberDetails.phoneNumber", resolvedPhoneNumber);
    }
  }, [inviteData]);

  // Form submission handler
  // const onSubmit = (data: any) => {
  //   // console.log('Form submitted with:', data);
  //   handleFormSubmit(data);
  // };
  // Handle country code selection
  const handleCountryCodeSelect = (code: string) => {
    setValue("phoneNumberDetails.countryCode", code);
    setShowCountryDropdown(false);
  };

  // Send OTP handler
  const onSendOtp = async (data: any) => {
    const success = await handleSendOtp(data);
    if (success) {
      setIsOtpSent(true);
      toast.info("OTP sent successfully. Please check your email.", getToastOptions());
      setTimeout(() => setResendOtp(true), 10000);
    }
  };

  // Verify OTP handler
  const onVerifyOtp = async () => {
    const otp = watch("otp");
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP", getToastOptions());
      return;
    }
    await handleVerifyOtp(watch("email"), otp, watch("password"));
  };


  const handleResendOtp = async () => {
    try {
      await toast.promise(
        CognitoServiceObj.resendOtp({ username: watch("email") }), // Fixed function call
        {
          pending: "Sending OTP...",
          success: "OTP sent successfully!",
          error: "Failed to resend OTP",
        },
        getToastOptions()
      );
    } catch (error) {
      console.error("OTP resend failed", error);
    }
  };

  
  return (
  <div>
    <div className="flex justify-center items-center">
      <img src={logo_text} alt="Worko Logo" className="w-32 h-auto" />
    </div>
    <form onSubmit={handleSubmit(isOtpSent ? onVerifyOtp : onSendOtp)} className="w-full">
      <p className="font-semibold text-gray-700 text-2xl text-center">Agency Signup </p>
      <div className="mainForm min-w-full grid sm:grid-cols-[repeat(2,_minmax(300px,_350px))] grid-row-[min-content]  gap-4 w-full px-2 sm:px-3 md:py-6 rounded-2xl mx-auto sm:py-2 min-h-[350px] ">
        <div>
          <label className="block font-medium">Full name</label>
          <input
            type="text"
            className="input_primary auth_input capitalize"
            {...register("name")}
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="input_primary auth_input "
            {...register("email")}
            disabled
          />
        </div>

        <div>
          <label className="block font-medium">Agency name</label>
          <input
            type="text"
            className="input_primary auth_input capitalize"
            {...register("agencyName")}
            disabled
          />
        </div>
        {/* Phone with Country Code */}
        <div>
          <label className="block font-medium">Contact No</label>
          <div className="flex ">
            {/* Country Code Dropdown */}
            <div className="relative country-dropdown-container max-h-44">
              <div
                className={`
                  input_primary auth_input !rounded-r-none h-full !w-[80px] flex items-center justify-between 
                  ${true ? 'pointer-events-none opacity-70 cursor-not-allowed' : 'cursor-pointer'}
                `}
                onClick={() => {
                    if (true) return; 
                    setShowCountryDropdown(!showCountryDropdown);
                  }}>
                <span>{watch("phoneNumberDetails.countryCode")}</span>
                <ChevronDown size={14} />
              </div>

              {/* Dropdown list */}
              {showCountryDropdown && (
                <div className="absolute z-10 top-full left-0 mt-1 w-48 max-h-44 overflow-y-auto bg-white shadow-lg rounded border">
                  {countryCodes.map((item) => (
                    <div
                      key={item.code}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
                      onClick={() => handleCountryCodeSelect(item.code)}>
                      <span className="font-medium">{item.code}</span>
                      <span className="text-gray-500">{item.country}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Number Input */}
            <input
              placeholder="Contact number"
              type="text"
              className="input_primary auth_input !rounded-l-none flex-1"
              {...register("phoneNumberDetails.phoneNumber")}
              disabled
            />
          </div>
          <p className="text-sm text-left text-red-500">
            {errors.phoneNumberDetails?.phoneNumber?.message}
          </p>
        </div>
        {/* Password */}
        <div className="relative">
          <label className="block font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className={`input_primary auth_input  ${errors.password && "error"}`}
            {...register("password", validationRules.password)}
          />
          <span
            className="absolute right-3 top-9 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <i className="fa-regular fa-eye-slash mt-2"></i>
            ) : (
              <i className="fa-regular fa-eye mt-2"></i>
            )}
          </span>
          {errors.password && (
            <p className="text-sm text-left text-red-500">{errors.password.message?.toString()}</p>
          )}
        </div>
        {/* Confirm Password */}
        <div className="relative">
          <label className="block font-medium">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className={`input_primary auth_input  ${errors.confirmPassword && "error"}`}
            {...register("confirmPassword", validationRules.confirmPassword(watch))}
          />
          <span
            className="absolute right-3 top-9 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? (
              <i className="fa-regular fa-eye-slash mt-2"></i>
            ) : (
              <i className="fa-regular fa-eye mt-2"></i>
            )}
          </span>
          {errors.confirmPassword && (
            <p className="text-sm text-left text-red-500">
              {errors.confirmPassword.message?.toString()}
            </p>
          )}
        </div>
      </div>
        {/* OTP Input */}
        {isOtpSent && (
          <div className="flex flex-col items-center">
            <label className="block font-medium mb-1">Enter OTP</label>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter OTP"
              className="input_primary auth_input text-center w-[250px]"
              {...register("otp")}
            />
            {resendOtp && (
              <p
                className="text-sm text-blue-500 cursor-pointer mt-2"
                onClick={handleResendOtp}>
                Resend OTP
              </p>
            )}
          </div>
        )}

      <div className="flex flex-col gap-1 mt-2 text-xs items-center justify-center  ">
        <div className="flex gap-2 text-xs items-center justify-center">
          <input
            disabled={isOtpSent}
            type="checkbox"
            {...register("termsAndConditions", validationRules.termsAndConditions)}
            checked={watch("termsAndConditions")}
          />
          <p
            className="block md:w-auto text-sm sm:text-md text-left font-medium cursor-pointer"
            onClick={() => !isOtpSent && setViewTerms(true)}
            >
            I accept the <span className="text-blue-500 cursor-pointer">Terms and Conditions</span>
          </p>
        </div>
        <div>
          <p className="text-sm text-red-500">
              {errors.termsAndConditions?.message}
          </p>
        </div>
      </div>
      <br />
        {ViewTerms && (
          <MessageModalTermsAndCondidtions
            type="none"
            size="2xl"
            heading={{ type: "info", message: "Terms and Conditions" }}
            // message={TermsAndConditionsAgency}
            onClose={() => {
              setViewTerms(false);
            }}
            showCloseButton={false}
            buttons={[
              {
                label: "Accept",
                action: () => {
                  setViewTerms(false);
                  setValue("termsAndConditions", true, { shouldValidate: true });
                },
                type: "primary",
              },
              {
                label: "Decline",
                action: () => {
                  setViewTerms(false);
                  setValue("termsAndConditions", false, { shouldValidate: true });
                },
                type: "danger",
              },
            ]}
          />
        )}
      <button type="submit" className="btn_primary w-[250px]">
        {isOtpSent ? "Create Account" : "Verify Account"}
      </button>
    </form>
  </div>
  );
};

export default AgencySignupForm;
