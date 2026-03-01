import { AgencyJobsList } from '@Interfaces/AgencyDashboardList.dto';
import { SendIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import DuplicateModal from './DuplicateModal';
import httpServiceObj from '@Services/ApiHandler.service';
import { toast } from 'react-toastify';
import { getToastOptions } from '@Utils/Toast.utils';
import { useAppContext } from '@Context/App.context';

interface UploadToAwsData{
  awsS3SignedUrl: string;
  cloudFileName: string;
  fileExtension: string;
  fileMimeType: string;
  userFileName: string;
}

interface UploadProfileProps{
    dashboardType:string;
    onClose: () => void;
    isOpen: boolean;
    rowData: AgencyJobsList | null;
    localUpdate: (id: string, updatedData: Partial<any>) => void;
}

interface Education {
  collage:string;
  degree:string;
  passingYear:string;
  startedYear:string;
}

interface MultipleCandidateExperience {
  companyId:string;
  companyName:string;
  designation:string;
  department:string;
  YOE?: number;
  startDate?: string;
  endDate?: string;
}

interface FormValues {
  candidateName: string;
  candidateEmail: string;
  candidateContact: string;
  currentCompany: string;
  currentDesignation: string;
  totalYOE:number | null;
  relevantYOE:number | null;
  currentCTC:number | null;
  expectedCTC:number | null;
  location:string;
  relocate:boolean;
  noticePeriod:number | null;
  negotiable:boolean;
  cv: FileList;
  comments:string;
  coreSkills:any;
  technicalSkills:any;
  userPreferredDepartments:string[];
  userPreferredIndustries:string[];
  userPreferredRoles:string[];
  userPreferredlocations:string[];
  education:Education[];
  about:string;
  multipleCandidateExperience:MultipleCandidateExperience[]
}

type ParsedCandidate = {
  name?: string;
  email?: string;
  phoneNumberDetails?: { number?: string };
  currentCompany?: string;
  currentDesignation?: string;
  totalYOE?: number;
  relevantYOE?: number;
  location?: string;
  coreSkills:any;
  technicalSkills:any;
  userPreferredDepartments:string[];
  userPreferredIndustries:string[];
  userPreferredRoles:string[];
  userPreferredlocations:string[];
  education:Education[];
  about:string;
  multipleCandidateExperience:MultipleCandidateExperience[]
};

const UploadProfile:React.FC<UploadProfileProps> = ({dashboardType,onClose,isOpen,rowData,localUpdate}) => {
  const { register, handleSubmit, reset, setValue, watch,formState: { errors },} = useForm<FormValues>({ mode: "onChange",
        defaultValues: {
          candidateName: "",
          candidateEmail: "",
          candidateContact:"",
          currentCompany: "",
          currentDesignation: "",
          totalYOE:null,
          relevantYOE:null,
          currentCTC:null,
          expectedCTC:null,
          location:"",
          relocate:true,
          noticePeriod:0,
          negotiable:true,
          comments:"",
          coreSkills:[],
          technicalSkills:[],
          userPreferredDepartments:[],
          userPreferredIndustries:[],
          userPreferredRoles:[],
          userPreferredlocations:[],
          education:[],
          about:"",
          multipleCandidateExperience:[],
        },
      });
      const [visible, setVisible] = useState(false);
      const [isAnimatingIn, setIsAnimatingIn] = useState(false);
      const [isSubmitting,setIsSubmitting]  = useState(false);
      const [isDuplicateModal,setIsDuplicateModal] = useState(false);
      const [isResumeValid,setIsResumeValid] = useState(false);
      const [permanentDisable,setPermanentDisable] = useState(true);
      const [isContactNumberValid,setIsContactNumberValid] = useState(true);
      const [showFullForm,setShowFullForm] = useState<boolean>(false);
      const [isCVParsing, setIsCVParsing] = useState<boolean>(false)
      const [cloudFileName,setCloudFileName] = useState<string | undefined>("");
      const { userDetails } = useAppContext();
      const modalRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
      if (isOpen) {
          setVisible(true);
          const timer = setTimeout(() => setIsAnimatingIn(true), 10);
          return () => clearTimeout(timer);
      } else {
          setIsAnimatingIn(false);
          const timer = setTimeout(() => setVisible(false), 300);
          return () => clearTimeout(timer);
      }
      }, [isOpen]);
    
      const handleCVUpload = async(e:any) => {
        if(!rowData){
          toast.error("Company details not found",getToastOptions({}))
          return
        }
        if(!userDetails){
          toast.error("User details not found",getToastOptions({}))
          return
        }

        setIsContactNumberValid(true)
        setShowFullForm(false)

        setValue("candidateName", "");
        setValue("candidateEmail", "");
        setValue("candidateContact", "");
        setValue("currentCompany", "");
        setValue("currentDesignation", "");
        setValue("totalYOE", null);
        setValue("relevantYOE", null);
        setValue("location", "");
        setValue("relocate", true);
        setValue("noticePeriod", 0);
        setValue("negotiable", true);
        setValue("coreSkills", []);
        setValue("technicalSkills", []);
        setValue("userPreferredDepartments", []);
        setValue("userPreferredIndustries", []);
        setValue("userPreferredRoles", []);
        setValue("userPreferredlocations", []);
        setValue("education", []);
        setValue("about", "");
        setValue("multipleCandidateExperience", []);

        // console.log(e.target.files[0])
        const cvFile = e.target.files[0]
        const payloadForAws = {
          companyId: rowData?.jobDetails?.companyId,
          jobId: rowData?.jobDetails?.id,
          fileName: cvFile.name,
          fileMimeType: "application/pdf"
        }
        if(cvFile){
          setIsCVParsing(true)
        }
        const responseFromAws = await creatingRequestToUploadToAws(payloadForAws);
        // console.log(responseFromAws,"response from aws")
        if (!responseFromAws.success) {
          toast.error("Failed to upload contract copy", getToastOptions({}));
          setIsCVParsing(false)
          return;
        }
        setCloudFileName(responseFromAws?.data?.cloudFileName)
        // 2. upload cv to s3 bucket this will give s3filename
        const payloadForFileUpload = {
          fileType: responseFromAws?.data?.fileMimeType
        }
        const fileUpload = await uploadFileToAws(responseFromAws?.data?.awsS3SignedUrl, cvFile,payloadForFileUpload);

        // 3. only posting cloudfilename
        const updatedPayload = {
          companyId: rowData?.jobDetails?.companyId,
          jobId: rowData?.jobDetails?.id,
          candidateParsedCvAwsS3FileName: responseFromAws?.data?.cloudFileName,
          agencyUserInviteId:rowData?.agencyUserInviteId,
        }
        const createResponse = await uploadingProfileWithOnlyCVName(updatedPayload);
        if(!createResponse?.success && (createResponse?.error as { message?: string })?.message === "Failed to parse CV."){
          toast.error("Failed to parse CV. Please upload a valid CV in pdf format only", getToastOptions({}));
          setIsCVParsing(false)
          return
        }
        if (!createResponse?.success) {
          setIsDuplicateModal(true)
          setIsCVParsing(false)
          return;
        }
        setShowFullForm(true)
        const data = createResponse.data as ParsedCandidate;
        setValue("candidateName", data?.name ?? "");
        setValue("candidateEmail", data?.email ?? "");
        setValue("candidateContact", data?.phoneNumberDetails?.number ?? "");
        setValue("currentCompany", data?.currentCompany ?? "");
        setValue("currentDesignation", data?.currentDesignation ?? "");
        setValue("totalYOE", data?.totalYOE ?? null);
        setValue("relevantYOE", data?.relevantYOE ?? null);
        setValue("location", data?.location ?? "");
        setValue("relocate", true);
        setValue("noticePeriod", 0);
        setValue("negotiable", true);
        setValue("coreSkills", data?.coreSkills ?? []);
        setValue("technicalSkills", data?.technicalSkills ?? []);
        setValue("userPreferredDepartments", data?.userPreferredDepartments ?? []);
        setValue("userPreferredIndustries", data?.userPreferredIndustries ?? []);
        setValue("userPreferredRoles", data?.userPreferredRoles ?? []);
        setValue("userPreferredlocations", data?.userPreferredlocations ?? []);  
        setValue("education", data?.education ?? []);
        setValue("about", data?.about ?? "");  
        setValue("multipleCandidateExperience", data?.multipleCandidateExperience ?? []);
        if(data?.phoneNumberDetails?.number?.toString().length !== 10){
          setIsContactNumberValid(false)
        }
        setIsResumeValid(true)
        setIsCVParsing(false)
      }

    const formSubmit = async (data: any) => {
      setIsSubmitting(true)
      data.relocate = data.relocate === "true" || data.relocate === "yes" ? true : false;

      if(!data.candidateName || !data.candidateEmail || !data.candidateContact || !data.currentCompany
        || !data.currentDesignation || !data.totalYOE || !data.relevantYOE || !data.currentCTC || !data.expectedCTC || !data.location || data.relocate === undefined || data.noticePeriod === null || data.noticePeriod === undefined || data.negotiable === undefined || !data.cv?.length){
          toast.error("please fill all the required fields",getToastOptions({}))
          setIsSubmitting(false)
          return
      }
      if(!rowData){
        toast.error("Company details not found",getToastOptions({}))
        return
      }
      if(!userDetails){
        toast.error("User details not found",getToastOptions({}))
        return
      }
        try {
          const payload={
              name: data?.candidateName,
              email: data?.candidateEmail,
              phoneNumberDetails: {
                  number: data?.candidateContact,
                  countryCode: 91
              },
              currentCompany: data?.currentCompany,
              currentDesignation: data?.currentDesignation,
              totalYOE: Number(data?.totalYOE),
              relevantYOE: Number(data?.relevantYOE),
              currentCTC: Number(data?.currentCTC),
              expectedCTC: Number(data?.expectedCTC),
              noticePeriod: Number(data?.noticePeriod),
              location: data?.location,
              readyToRelocate: data?.relocate,
              isNoticePeriodNegotiable: data?.negotiable,
              cvAwsS3FileName: cloudFileName,
              companyId: rowData?.jobDetails?.companyId,
              jobId: rowData?.jobDetails?.id,
              agencyUserInviteId:rowData?.agencyUserInviteId,
              coreSkills: data?.coreSkills ?? [],
              technicalSkills: data?.technicalSkills ?? [],
              userPreferredDepartments: data?.userPreferredDepartments ?? [],
              userPreferredIndustries: data?.userPreferredIndustries ?? [],
              userPreferredlocations: data?.userPreferredlocations ?? [],
              userPreferredRoles: data?.userPreferredRoles ?? [],
              education:data?.education ?? [],
              about:data?.about,
              multipleCandidateExperience:data?.multipleCandidateExperience ?? [],
          } as any;      

          if (data?.comments?.trim()) {
            payload.agencyComments = data.comments.trim();
          }
          const uploadResponse:any = await uploadingProfileWithAllFields(payload);
          if (!uploadResponse.success) {
            // console.log(uploadResponse.data)
            // setIsDuplicateModal(true)
            toast.error(uploadResponse.data.message, getToastOptions({}));
            return; 
          }
          toast.success("Profile uploaded successfully",getToastOptions({}))
          if(rowData?.totalCandidatesUploaded){
              const updatedData = {...rowData,totalCandidatesUploaded:rowData?.totalCandidatesUploaded + 1}
              localUpdate(rowData?.id,updatedData)
          }else{
              const updatedData = {...rowData,totalCandidatesUploaded:1}
              localUpdate(rowData?.id,updatedData)
          }
          setShowFullForm(false)
          reset()
          onClose()
        } catch (error) {
          console.log(error)
          toast.error("Network error please try again later",getToastOptions({}))
        } finally{
          setIsSubmitting(false)
        }
      }
    
      const uploadingProfileWithAllFields = async (payload: any) => {
        try {
          const { response, error } = await httpServiceObj.post(`/agency-user-submission/`, payload, true, {}, false,"BASE");
          if (response) {
            return { success: true, data: response };
          }
          return { success: false, data:error };
        } catch (error) {
          console.error("Upload failed:", error);
          return { success: false, data:error };
        }
      };

      const creatingRequestToUploadToAws = async (payload: any) => {
        try {
          const { response } = await httpServiceObj.post<UploadToAwsData>(`/file/gsu2u/AGENCY_SUBMIT_USER_CV`, payload, true, {}, false,"BASE");
          if (response) {
            return { success: true, data: response };
          }
          return { success: false };
        } catch (error) {
          console.error("Upload failed:", error);
          return { success: false, error };
        }
      };

      const uploadFileToAws = async (url:any,contractFile:any,payload: any) => {
        try {
          const { response } = await httpServiceObj.put(url, contractFile, false, payload, true);
          if (response) {
            return { success: true, data: response };
          }
          return { success: false };
        } catch (error) {
          console.error("Upload failed:", error);
          return { success: false, error };
        }
      };

      const uploadingProfileWithOnlyCVName = async (payload: any) => {
        try {
          const { response,error } = await httpServiceObj.post(`/agency-user-submission/candidate-parse-cv`, payload, true, {}, false,"BASE");
          if(error){
            toast.error(error.message,getToastOptions({}))
            return
          }
          if (response) {
            return { success: true, data: response };
          }
          return { success: false,error };
        } catch (error) {
          console.error("Agency creation failed:", error);
          return { success: false, error };
        }
      };

    return (
      <div
        onMouseDown={(e) => {
          if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setShowFullForm(false)
            reset();
            onClose();
          }
        }}
        className={`fixed inset-0 z-50 flex items-start justify-end transition-opacity duration-300 ease-in-out ${
          isAnimatingIn ? "bg-black bg-opacity-50" : "bg-opacity-0 bg-black"
        } ${visible ? "visible" : "invisible"}`}>
        <div
          ref={modalRef}
          className={`bg-white rounded-l-lg p-6 w-full max-w-md relative transform transition-transform duration-300 ease-in-out self-auto max-h-[100vh] overflow-y-auto ${
          !isAnimatingIn ? "animate-slide-out" : "animate-slide-in"
          }`}>
          <button
            onClick={()=>{
                setShowFullForm(false)
                reset();
                onClose();}}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            ×
          </button>
  
          <h2 className="text-xl font-semibold mb-4 text-left">Upload profile</h2>
  
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className='text-left mt-4'>
              <label htmlFor="cv">CV (PDF only)<span className='text-red-500'>*</span></label>
              <input
                  type="file"
                  accept="application/pdf"
                  {...register("cv", {
                  required: "please upload candidate cv",
                  validate: {
                      isPdf: (value: FileList) =>
                      value?.[0]?.type === "application/pdf" || "Only PDF files are allowed.",
                      isUnder5MB: (value: FileList) =>
                      value?.[0]?.size <= 5 * 1024 * 1024 || "File size must be under 5MB",
                  },
                  })}
                  className="input_primary auth_input"
                    onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;

                    const file = files[0];
                    if (!file || file.type !== "application/pdf") {
                      toast.error("Only PDF files are allowed",getToastOptions({}));
                      return;
                    }
                    register("cv").onChange(e);
                    handleCVUpload(e);
                  }}
              />
              {errors.cv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cv.message}</p>
              )}
            </div>
            {isCVParsing && 
            <div className='text-left'>
            <span className='text-xs'>Cv is being parsed please wait...</span>
            </div>}
            {showFullForm &&
            <div className='text-left'>
                <label>Candidate name<span className='text-red-500'>*</span></label>
                <input
                disabled={permanentDisable}
                // placeholder='Rahul yadav'
                type="text"
                className="input_primary auth_input capitalize"
                {...register("candidateName", { required: "Candidate name is required." })}
                />
                {errors.candidateName && <p className="text-red-500 text-sm mt-1">{errors.candidateName.message}</p>}
            </div>}
  
              {showFullForm &&
              <div className='text-left'>
                  <label htmlFor="">Candidate email<span className='text-red-500'>*</span></label>
                  <input 
                  disabled={permanentDisable}                  
                  // placeholder='rahulyadav@gmail.com'
                  type="text" 
                  className="input_primary auth_input"
                  {...register("candidateEmail", {
                    required: "Candidate email is required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email",
                    },
                    })}
                  />
                {errors.candidateEmail && <p className="text-red-500 text-sm mt-1">{errors.candidateEmail.message}</p>}
              </div>}
              
              {showFullForm &&
              <div className='text-left'>
                  <label htmlFor="">Current contact no<span className='text-red-500'>*</span></label>
                  <input
                  disabled={isContactNumberValid}
                  // placeholder='Enter valid contact number'
                  maxLength={10}
                    type="text"
                    className="input_primary auth_input capitalize"
                    {...register("candidateContact", {
                        required: "candidate contact number is required",
                        pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Contact number must be exactly 10 digits",
                        },
                    })}
                    onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        input.value = input.value.replace(/\D/g, '');
                    }}
                    />
                  {errors.candidateContact && <p className="text-red-500 text-sm mt-1">{errors.candidateContact.message}</p>}
              </div>}

              {/* ask if current company is optional or manditory*/}
              {showFullForm &&
              <div className='text-left'>
                  <label htmlFor="">Current company<span className='text-red-500'>*</span></label>
                  <input 
                    disabled={!isResumeValid}
                    // placeholder='Infosys'
                    type="text" 
                    className="input_primary auth_input"
                    {...register("currentCompany",{required:"Current company is required"})}
                  />
                  {errors.currentCompany && <p className="text-red-500 text-sm mt-1">{errors.currentCompany.message}</p>}
              </div>}

              {showFullForm &&
              <div className='text-left'>
                  <label htmlFor="">Current designation<span className='text-red-500'>*</span></label>
                  <input 
                    disabled={!isResumeValid}
                    // placeholder='sales manager'
                    type="text" 
                    className="input_primary auth_input capitalize"
                    {...register("currentDesignation", {required: "please specify the designation"})}
                  />
                {errors.currentDesignation && <p className="text-red-500 text-sm mt-1">{errors.currentDesignation.message}</p>}
              </div>}

            {/* ask if experience is in months how to handle and what is its a fresher*/} {/* total and relevant yoe */}
            {showFullForm &&
            <div className='flex flex-row gap-3'>
                <div className='text-left'>
                    <label htmlFor="">Total YOE (in years)<span className='text-red-500'>*</span></label>
                    <input 
                      disabled={!isResumeValid}
                      // placeholder='total experience'
                      type="number" 
                      className="input_primary auth_input"
                      step="0.1"
                      // onKeyDown={(e) => {
                      //   if (["-", "+", ".", "e", "E"].includes(e.key)) {
                      //     e.preventDefault();
                      //   }
                      // }}
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                      {...register("totalYOE",{
                          required:"total experience must be filled",
                          min: { value: 0, message: "Experience cannot be negative" }
                        },
                      )}
                    />
                    {errors.totalYOE && <p className="text-red-500 text-sm mt-1">{errors.totalYOE.message}</p>}
                </div>
                <div className='text-left'>
                    <label htmlFor="">Relevant YOE (in years)<span className='text-red-500'>*</span></label>
                    <input 
                      disabled={!isResumeValid}
                      // placeholder='relevant experience'
                      type="number" 
                      step="0.1"
                      className="input_primary auth_input"
                      // onKeyDown={(e) => {
                      //   if (["-", "+", ".", "e", "E"].includes(e.key)) {
                      //     e.preventDefault();
                      //   }
                      // }}
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                      {...register("relevantYOE",{
                        required:"relevant experience must be filled",
                        min: { value: 0, message: "Experience cannot be negative" }
                      })}
                    />
                    {errors.relevantYOE && <p className="text-red-500 text-sm mt-1">{errors.relevantYOE.message}</p>}
                </div>
            </div>}

            {/* current and expected ctc */}
            {showFullForm &&
            <div className='flex flex-row gap-3'>
                <div className='text-left'>
                    <label htmlFor="">Current CTC (in LPA)<span className='text-red-500'>*</span></label>
                    <input 
                      disabled={!isResumeValid}
                      type="number" 
                      step="0.1"
                      placeholder='Enter your salary in LPA'
                      className="input_primary auth_input placeholder:text-xs"
                      // onKeyDown={(e) => {
                      //   if (["-", "+", ".", "e", "E"].includes(e.key)) {
                      //     e.preventDefault();
                      //   }
                      // }}
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                      {...register("currentCTC",{
                        required:"current Ctc is required",
                        min: { value: 0, message: "Current CTC cannot be negative" },
                        max: { value: 300, message: "Max 300 allowed" },
                      })}
                    />
                    {errors.currentCTC && <p className="text-red-500 text-sm mt-1">{errors.currentCTC.message}</p>}
                    <p className='text-xs text-slate-500 text-left'>Enter your salary in LPA(e.g., 25 for 25,00,000 Lakhs per annum).</p>
                </div>
                <div className='text-left'>
                    <label htmlFor="">Expected CTC (in LPA)<span className='text-red-500'>*</span></label>
                    <input
                      disabled={!isResumeValid}
                      type="number" 
                      step="0.1"         
                      placeholder='Enter your salary in LPA'             
                      className="input_primary auth_input placeholder:text-xs"
                      // onKeyDown={(e) => {
                      //   if (["-", "+", ".", "e", "E"].includes(e.key)) {
                      //     e.preventDefault();
                      //   }
                      // }}
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                      {...register("expectedCTC",{
                        required:"Expected CTC is required",
                        min: { value: 0, message: "Expected CTC cannot be negative" },
                        max: { value: 400, message: "Max 400 allowed" },
                        validate: (value) => {
                          const current = Number(watch("currentCTC") ?? 0);
                          const expected = Number(value ?? 0);
                          return expected >= current || "Expected CTC cannot be less than Current CTC";
                        }
                      })}
                    />
                    {errors.expectedCTC && <p className="text-red-500 text-sm mt-1">{errors.expectedCTC.message}</p>}
                    <p className='text-xs text-slate-500 text-left'>Enter your salary in LPA(e.g., 25 for 25,00,000 Lakhs per annum).</p>
                </div>
            </div>}

            {/* location and preference */}
            {showFullForm &&
            <div className='flex flex-row gap-3'>
                <div className='text-left flex-1'>
                    <label htmlFor="">Location (current)<span className='text-red-500'>*</span></label>
                    <input
                      disabled={!isResumeValid}
                      // placeholder='mumbai'
                      type="text" 
                      className="input_primary auth_input"
                      {...register("location",{required:"current location is required"})}
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
                </div>
                <div className='text-left flex-1'>
                    <label htmlFor="">Ready to relocate<span className='text-red-500'>*</span></label>
                    <select
                      disabled={!isResumeValid}
                      className="input_primary auth_input text-gray-700"
                      style={{ color: "#374151" }}
                      {...register("relocate", {
                        required: "relocation preference is required",
                      })}
                      onChange={(e) => {
                        const value = e.target.value === "true";
                        setValue("relocate", value)
                      }}
                      defaultValue="true"
                    >
                      <option value="" style={{ color: "#374151" }}>Choose</option>
                      <option value="true" style={{ color: "#374151" }}>Yes</option>
                      <option value="false" style={{ color: "#374151" }}>No</option>
                    </select>

                    {errors.relocate && <p className="text-red-500 text-sm mt-1">{errors.relocate.message}</p>}
                </div>
            </div>}

            {/* notice period and negotiable */}
            {showFullForm &&
            <div className='flex flex-row gap-3 justify-center items-center'>
                <div className='text-left flex-1'>
                    <label htmlFor="">Notice period (in days)<span className='text-red-500'>*</span></label>
                    <select
                      disabled={!isResumeValid}
                      className="input_primary auth_input"
                      {...register("noticePeriod", {
                        required: "Notice period is required"
                      })}
                    >
                      <option value={0}>Immediate</option>
                      <option value={15}>15 Days</option>
                      <option value={30}>30 Days</option>
                      <option value={45}>45 Days</option>
                      <option value={60}>60 Days</option>
                      <option value={90}>90 Days</option>
                      <option value={120}>120 Days</option>
                    </select>
                    {errors.noticePeriod && <p className="text-red-500 text-sm mt-1">{errors.noticePeriod.message}</p>}
                </div>
                <div className='text-left flex-1'>
                    <label htmlFor="negotiable" className="flex items-center gap-2">
                    <input
                      disabled={!isResumeValid}
                      id="negotiable"
                      type="checkbox"
                      className="accent-blue-600 w-4 h-4"
                      {...register("negotiable")}
                    />
                    Negotiable<span className='text-red-500'>*</span>
                    </label>
                {errors.negotiable && <p className="text-red-500 text-[11px] mt-1">{errors.negotiable.message}</p>}
                </div>

            </div>}

            {showFullForm &&
            <div className='text-left flex-1'>
                <label htmlFor="">Any comments (optional) </label>
                <textarea 
                  disabled={!isResumeValid}
                  placeholder='Provide a brief comment'
                  className="input_primary auth_input"
                  {...register("comments")}
                />
            </div>}

            {showFullForm &&
            <div className="flex justify-start mt-4">
              <button
              disabled = {isSubmitting} 
              className="flex items-center gap-1 px-3 py-3 rounded-xl 
             bg-blue-600 text-white 
             hover:bg-blue-700
             disabled:opacity-50 disabled:cursor-not-allowed text-xs">
                <SendIcon className='h-3 w-3'/>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>}
          </form>
        </div>
        <DuplicateModal
          onClose={()=>setIsDuplicateModal(false)}
          isOpen={isDuplicateModal}
          />
      </div>
    )
  }

export default UploadProfile