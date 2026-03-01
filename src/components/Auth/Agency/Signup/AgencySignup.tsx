import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import httpServiceObj from "@Services/ApiHandler.service";
import AgencySignupForm from "./AgencySignupForm";
import MessageModal from "@Components/Modals/MessageModal";
import { toast } from "react-toastify";
import MainLoader from "@Components/Loader/Loader"; // Assuming you have a loader component
import CognitoServiceObj from "@Utils/Cognito.utils";
import { getToastOptions } from "@Utils/Toast.utils";
import { logo_text } from "@Assets";
import { AuthFormDto, AuthSignupBaseDto, CognitoSignupResponse } from "@Interfaces/Auth.dto";
import { useAppContext } from "@Context/App.context";
import { NormalizedUser, normalizeUserData } from "@Utils/NormalizeUser";
import secureStorage from "@Utils/SecureStorage.utils";
import { SecureStorageKeyEnum } from "@Enums/SecureStorage.enum";
import { currentSession } from "@Components/Auth/Login/LoginForm";
import { fetchAuthSession } from "aws-amplify/auth";

const AgencySignup = () => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const queryClient = useQueryClient();

  const [modalData, setModalData] = useState<{
    type: "none" | "error" | "warning" | "success" | "info";
    heading?: { message: string; type: "error" | "warning" | "success" | "info" };
    message: string;
    buttons?: { label: string; action: () => void; type?: "primary" | "danger" | "warning" | "success" }[];
  } | null>(null);
  const [hasProcessedExisting, setHasProcessedExisting] = useState<boolean>(false);
  const [CognitoResponse, setCognitoResponse] = useState<CognitoSignupResponse | null>(null);
  const [pendingProcessedSignup, setPendingProcessedSignup] = useState<AuthSignupBaseDto | null>(null);
  const { setPendingApply, tempCvFile, PendingApply, isLoggedIn, setUpdateCheck, setUserDetails } = useAppContext();
  const [userSub,setUserSub] = useState("")
  // Function to show error modals
  const showModalsError = (caseType: string) => {
    switch (caseType) {
      case "invalid":
        setModalData({
          type: "error",
          heading: { message: "Invalid Request", type: "error" },
          message: "The invite you are trying to access is invalid. Please contact the company for a valid invite.",
          buttons: [{ label: "Back to Home", action: () => navigateTo("/") }],
        });
        setTimeout(() => navigateTo("/"), 10000);
        break;
      case "expired_in":
        setModalData({
          type: "error",
          heading: { message: "Invite Expired", type: "error" },
          message: "The invite you are trying to access has expired. Please contact the company for a new invite.",
          buttons: [{ label: "Back to Home", action: () => navigateTo("/") }],
        });
        setTimeout(() => navigateTo("/"), 10000);
        break;
      default:
        setModalData({
          type: "error",
          heading: { message: "Something Went Wrong!", type: "error" },
          message: "Looks like something went wrong. Please try again later.",
          buttons: [{ label: "Back to Home", action: () => navigateTo("/") }],
        });
    }
  };

  // Function to save data to DynamoDB for existing evaluator
  const saveExistingEvaluatorData = async (formData: any) => {
    try {
    if (!data) {
      return false;
    }
      const dbData: any = {
        cognitoUserId: data.evaluatorCognitoUserId,
        companyId: data.companyId,
        email: data.email,
        inviteId: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        corporateUserType: data.corporateUserType,
      };

      // Add phone number if provided
      if (formData?.phoneNumberDetails) {
        dbData.phoneNumberDetails = formData.phoneNumberDetails;
      }
      const { response: dbResponse, error: dbError } = await httpServiceObj.post<any>("/corporate-user/", dbData, true);


      if (dbError) {
        toast.error("Failed to save user data. Please try again later.", getToastOptions());
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while saving data. Please try again later.", getToastOptions());
      return false;
    }
  };

  // Fetch data function
  const fetchData = async () => {
    const { response, error, status } = await httpServiceObj.get<any>(`/agency-invite/${id}`, true);

    if (status === 404) throw new Error("Invalid Request");
    if (error) throw new Error("Error fetching data" + error);

    if (["EXPIRED", "ACCEPTED", "DELETED"].includes(response?.inviteStatus)) {
      showModalsError("invalid");
    }
    return response;
  };

  // Fetch data using react-query
  const { isLoading, error, data } = useQuery({
    queryKey: ["inviteData", id],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2, // Retry twice before failing
    enabled: !!id, // Only run query if `id` exists
  });

  // Handle errors in useEffect to prevent infinite loop
  useEffect(() => {
    if (error) {
      toast.error(error.message, getToastOptions());
    }
  }, [error]);

  useEffect(() => {
    if (error) {
      showModalsError("invalid");
    }
  }, [error]);

  // function prepareDataforDB(cognitoId: string): any {
  //   return {
  //     cognitoUserId: cognitoId,
  //     companyId: data.companyId,
  //     email: data.email,
  //     inviteId: data.id,
  //     firstName: data.firstName,
  //     lastName: data.lastName,
  //     corporateUserType: data.corporateUserType,
  //   };
  // }

  // async function handleFormSubmit(formData: any) {
  //   // Check if evaluatorCognitoUserId exists - handle existing evaluator
  //   if (data?.evaluatorCognitoUserId) {
  //     const saved = await saveExistingEvaluatorData(formData);
  //     if (saved) {
  //       // Navigate to forgot password page after successful data save
  //       navigateTo("/auth/resetpassword", { 
  //         state: { 
  //           from: "corporate-signup", 
  //           email: data.email 
  //         } 
  //       });
  //     }
  //     return;
  //   }

  //   // Original signup flow for new users
  //   const signupData = {
  //     password: formData.password,
  //     username: formData.email,
  //     name: formData.name,
  //   };
    
  //   const { response, error } = await CognitoServiceObj.handleSignUp(signupData);
    
  //   if (error) {
  //     toast.error(error.message, getToastOptions());
  //     return;
  //   }
    
  //   if (response) {
  //     // Prepare data for DB
  //     const dbData = prepareDataforDB(response.userId);
  //     console.log(response.userId,"userId")
  //     // Add phone number to dbData if exists
  //     if (formData?.phoneNumberDetails) {
  //       dbData.phoneNumberDetails = formData.phoneNumberDetails;
  //     }
      
  //     const { response: dbResponse, error: dbError } = await httpServiceObj.post<any>("/corporate-user/", dbData, true);
      
  //     if (dbError) {
  //       toast.error("Something went wrong. Please try again later.", getToastOptions());
  //     } else {
  //       setModalData({
  //         type: "success",
  //         heading: { message: "Signup Successful", type: "success" },
  //         message: "You have successfully signed up. You will be redirected to the login page in 5 seconds.",
  //         buttons: [{ label: "Go to Login", action: () => navigateTo("/auth/corporate/login") }],
  //       });
  //       setTimeout(() => navigateTo("/auth/corporate/login"), 5000);
  //     }
  //   }
  // }

  // Auto-handle existing evaluator: save to DB and redirect to reset password
  
  useEffect(() => {
    const handleExisting = async () => {
      if (!data?.evaluatorCognitoUserId || hasProcessedExisting) return;
      setHasProcessedExisting(true);
      const saved = await saveExistingEvaluatorData(undefined);
      if (saved) {
        navigateTo("/auth/resetpassword", {
          state: {
            from: "corporate-signup",
            email: data.email,
            pagetype: "CORP",
          },
        });
      } else {
        setHasProcessedExisting(false);
      }
    };
    handleExisting();
  }, [data?.evaluatorCognitoUserId]);

  const buildProcessedForm = (data: AuthFormDto): AuthSignupBaseDto => {
    const base: AuthSignupBaseDto = {
      name: data.name.trim(),
      emailId: data.email.trim().toLowerCase(),
      password: data.password,
      candidateOtp: "",
      phoneNumber: data?.phoneNumberDetails?.phoneNumber,
      confirmPassword: data.confirmPassword,
      checkboxChecked: false,
      acceptedTermsAndConditions: !!data.termsAndConditions,
    };
    return base;
  };
  
  const mutateDatatoBackend = useCallback(
    async (id: string, processed: AuthSignupBaseDto) => {

      if (!id || id.trim().length === 0) {
        throw new Error("Client ID is required");
      }

      // Validate form data
      // if (!processed.name || !processed.emailId || !processed.phoneNumber) {
      //   throw new Error("Required form data is missing");
      // }

//       if (activeFrame === "CAND") {
// /*         // Validate candidate-specific data
//         if (processed.ctc < 0 || processed.ectc < 0) {
//           throw new Error("CTC values cannot be negative");
//         }
//  */
//         const candidateData: DevCandidateDto = {
//           name: processed.name.trim(),
//           email: processed.emailId.toLowerCase(),
//           number: "+91" + processed.phoneNumber,
//           userId: ClientId,
//           /* CTC: processed.ctc,
//           ECTC: processed.ectc, */
//           acceptedTermsAndConditions: processed.acceptedTermsAndConditions,
//         };

//         const { response, error } = await httpServiceObj.post(
//           "/user/register/candidate",
//           candidateData,
//           true
//         );

//         if (error) {
//           throw new Error(`Failed to register candidate: ${error.message}`);
//         }
//         if (selectedFile) {
//           await CvS3MemAllocation(response, processed.emailId, selectedFile);
//         }

//         return response;
//       } else {
//         // Validate employee-specific data
//         if (!CompanyDetails?.name || !CompanyDetails?.id) {
//           throw new Error("Company details are required for employee registration");
//         }
        const payload = { inviteId: id };
        const { response, error } = await httpServiceObj.post("/agency-user/", payload, true,);

        if (error) {
          throw new Error(`Failed to register employee: ${error.message}`);
        }

        return response;
      // }
    },
    []
  );

  const runCognitoBasicSignup = async (data: AuthFormDto): Promise<boolean> => {
    try {
      // Validate and filter form data
      // const selectedFile = metaDataFilter(data);

      // Always use the latest submitted values snapshot to avoid stale state
      const processed = buildProcessedForm(data);

      const signupform = {
        password: processed.password,
        username: processed.emailId,
        name: processed.name,
        phone_number: "+91" + processed.phoneNumber,
      };

      const { response, error } = await CognitoServiceObj.handleSignUp(signupform);

      if (error) {
        // Handle specific Cognito errors
        if (error.name === "UserLambdaValidationException" && error.message.includes("PreSignUp")) {
          toast.info(
            "An account with this email already exists. Please sign in instead.",
            getToastOptions({})
          );
          return false;
        } else {
          toast.error(error.message, getToastOptions());
          return false;
        }
      }

      if (response?.userId) {
        setCognitoResponse(response);
        try {
          // Use processed snapshot for backend mutation; ensure latest values were used to set state already
          setPendingProcessedSignup(processed);
          // toast.info("OTP sent to your email. Please verify it.", getToastOptions());

          return true;
        } catch (mutationError: any) {
          console.error("Error during backend mutation:", mutationError);
          toast.error(`Registration failed: ${mutationError.message}`, getToastOptions());
          return false;
        }
      }

      throw new Error("Invalid response from Cognito signup");
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error(`Signup failed: ${err.message}`, getToastOptions());
      return false;
    }
  };

  const handleVerifyOtp = async (email: string, otp: string, password: string) => {
    try {
      let signupform = {
        username: email,
        confirmationCode: otp,
      };
      let autoLoginData = {
        email: email,
        password: password,
      };
      const { response, error } = await CognitoServiceObj.handleSignUpConfirmation(signupform);

      // Check if the confirmation was successful
      if (response) {
        // toast.success("User registered successfully", getToastOptions());
        await handleAutoLogin(autoLoginData);
        // Handle the confirmed sign-up as needed
        try {
          if (pendingProcessedSignup && id) {
            await toast.promise(
              mutateDatatoBackend(id, pendingProcessedSignup),
              {
                pending: "Finalizing registration...",
                success: "User registered successfully",
                error: "Error registering user",
              },
              getToastOptions()
            );
            setPendingProcessedSignup(null);
            navigateTo("/agency/agInvites");
          } else {
            console.warn("No pending signup payload found for backend registration.");
          }
        } catch (backendErr: any) {
          console.error("Backend registration failed:", backendErr);
          toast.error(`Registration failed: ${backendErr.message}`, getToastOptions());
        }
        return { response: response };
      } else if (error) {
        throw error;
      }
      throw new Error("Unexpected error: No response or error.");
    } catch (error: any) {
      toast.error(error.message, getToastOptions());
    }
  };
    const handleAutoLogin = async (data: any): Promise<void> => {
    const loginData = {
      email: data.email,
      password: data.password,
    };

    try {
      const { response, error } = await CognitoServiceObj.handleSignIn(loginData);
      // if (error) {
      //   toast.error(error.message, getToastOptions());
      //   window.location.href = "/auth/login";
      // } else {
      //   if (response?.isSignedIn) {
      //     const session = await fetchAuthSession();
      //     const { response: userResponse, error: userError } = await httpServiceObj.get<any>(`/agency-user/${session.userSub}/cognito`, true, {}, false,"BASE");
          // if (userError) {
          //   toast.error("Error: " + userError, getToastOptions());
          //   throw new Error();
          // } else {
          //   // Extract the first element from the array response
          //   const user: NormalizedUser = normalizeUserData(userResponse?.[0] || {});
          //   console.log(user)
          //   debugger
          //   setUserDetails(user);

          //   if (!user) {
          //     toast.error("Error: No user data found", getToastOptions());
          //     throw new Error();
          //   }

          //   // Store user details
          //   secureStorage.setItem(SecureStorageKeyEnum.LASTACCESSEDDASH, user.lastAccessedDash);
          //   secureStorage.setItem(SecureStorageKeyEnum.USERNAME, user.fullName);
          //   secureStorage.setItem<NormalizedUser>(SecureStorageKeyEnum.LOGINDETAILS, user);

          //   await currentSession();
          //   setUpdateCheck((prev) => !prev);
          //   toast.success("Successfully signed in", getToastOptions());
          //   // checkBasicDetails();
          // }
      //   }
      // }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong", getToastOptions());
      // CognitoServiceObj.handleSignOut();
    }
  };
  return (
    <div id="Authlayout" className="min-h-screen overflow-auto flex justify-center items-center w-full bg-white relative">
      <div className="absolute bottom-0 -left-48 w-[25vw] h-[20vw] rounded-[10vh] rotate-[245deg] z-10 bg-gradient-to-b from-cyan-400 to-blue-500 hidden lg:block"></div>
      <div className="absolute top-0 -right-48 w-[25vw] h-[20vw] rounded-[10vh] rotate-[65deg] z-10 bg-gradient-to-b from-cyan-400 to-blue-500 hidden lg:block"></div>
      
      {/* worko logo */}
      {/* <div className="absolute top-4 center-4 z-20 bc">
        <img src={logo_text} alt="Worko Logo" className="w-32 h-auto" />
      </div> */}
      
      {isLoading && !data ? (
        <MainLoader />
      ) : data && data.evaluatorCognitoUserId ? (
        // Show loader or message while processing existing evaluator
        <div className="flex flex-col items-center justify-center gap-4 z-20">
          <MainLoader />
          <p className="text-gray-600 text-center">Setting up your account...</p>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4 z-20 w-min">
          <AgencySignupForm 
            inviteData={data} 
            // handleFormSubmit={handleFormSubmit}
            handleSendOtp={runCognitoBasicSignup}
            handleVerifyOtp={handleVerifyOtp}
          />
        </div>
      )}

      {/* Show modal only when modalData is set */}
      {modalData && <MessageModal {...modalData} onClose={() => setModalData(null)} showCloseButton={false} />}
    </div>
  );
};

export default AgencySignup;