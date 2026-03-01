import { AgencyJobsList } from '@Interfaces/AgencyDashboardList.dto';
import { SendIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import DuplicateModal from './DuplicateModal';
import httpServiceObj from '@Services/ApiHandler.service';
import { toast } from 'react-toastify';
import { getToastOptions } from '@Utils/Toast.utils';
import { useAppContext } from '@Context/App.context';
import NoDuplicateModal from './NoDuplicateModal';

interface UploadToAwsData{
  awsS3SignedUrl: string;
  cloudFileName: string;
  fileExtension: string;
  fileMimeType: string;
  userFileName: string;
}

interface DuplicateUploadProfileCheckProps{
    dashboardType:string;
    onClose: () => void;
    isOpen: boolean;
    rowData: AgencyJobsList | null;
}

interface FormValues {
  candidateName: string;
  candidateEmail: string;
  candidateContact: string;
  currentCompany: string;
}

const DuplicateUploadProfileCheck:React.FC<DuplicateUploadProfileCheckProps> = ({dashboardType,onClose,isOpen,rowData}) => {
  const { register, handleSubmit, reset, setValue, watch,formState: { errors },} = useForm<FormValues>({ mode: "onChange",
        defaultValues: {
          candidateName: "",
          candidateEmail: "",
          candidateContact:"",
          currentCompany: "",
        },
      });
      const [visible, setVisible] = useState(false);
      const [isAnimatingIn, setIsAnimatingIn] = useState(false);
      const [isSubmitting,setIsSubmitting]  = useState(false);
      const [isDuplicateModal,setIsDuplicateModal] = useState(false);
      const [isNotDuplicateModal,setIsNotDuplicateModal] = useState(false);
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
      
    const formSubmit = async (data: any) => {
      setIsSubmitting(true)
      
      if(!data.candidateName || !data.candidateEmail || !data.candidateContact || !data.currentCompany){
          toast.error("please fill all the required fields",getToastOptions({}))
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
      const params = {
        companyId:rowData?.jobDetails?.companyId,
        candidateEmailId:data?.candidateEmail,
        phoneNumber:data?.candidateContact,
        phoneCountryCode:91
      }
      try {
      const {response} = await httpServiceObj.get<any>(`/corporate-candidate-profile/duplicate`,true,params,false,"BASE") 
      if(response.isDuplicateProfile){
        setIsDuplicateModal(true)
      }else{
        setIsNotDuplicateModal(true)
      }
        onClose()
      } catch (error) {
        console.log(error)
        toast.error("Network error please try again later",getToastOptions({}))
      } finally{
        setIsSubmitting(false)
      }
    }

    return (
      <div
        onMouseDown={(e) => {
          if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
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
                reset();
                onClose();}}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            ×
          </button>
  
          <h2 className="text-xl font-semibold mb-4 text-left">Check duplicate profile</h2>
  
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className='text-left'>
                <label>Candidate name<span className='text-red-500'>*</span></label>
                <input
                placeholder='Rahul yadav'
                type="text"
                className="input_primary auth_input capitalize"
                {...register("candidateName", { required: "Candidate name is required." })}
                />
                {errors.candidateName && <p className="text-red-500 text-sm mt-1">{errors.candidateName.message}</p>}
            </div>
  
              <div className='text-left'>
                  <label htmlFor="">Candidate email<span className='text-red-500'>*</span></label>
                  <input 
                  placeholder='rahulyadav@gmail.com'
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
              </div>
  
                <div className='text-left'>
                  <label htmlFor="">Current contact no<span className='text-red-500'>*</span></label>
                  <input
                  placeholder='Enter valid contact number'
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
                        input.value = input.value.replace(/\D/g, ''); // remove non-digits
                    }}
                    />
                  {errors.candidateContact && <p className="text-red-500 text-sm mt-1">{errors.candidateContact.message}</p>}
              </div>

              {/* ask if current company is optional or manditory*/}
              <div className='text-left'>
                  <label htmlFor="">Current company<span className='text-red-500'>*</span></label>
                  <input 
                  placeholder='Infosys'
                  type="text" 
                  className="input_primary auth_input"
                  {...register("currentCompany",{required:"Current company is required"})}
                  />
                  {errors.currentCompany && <p className="text-red-500 text-sm mt-1">{errors.currentCompany.message}</p>}
              </div>

            <div className="flex justify-start mt-4">
              <button
              disabled = {isSubmitting} 
              className="flex items-center gap-1 px-3 py-3 rounded-xl 
             bg-blue-600 text-white 
             hover:bg-blue-700
             disabled:opacity-50 disabled:cursor-not-allowed text-xs">
                <SendIcon className='h-3 w-3'/>
                {isSubmitting ? 'Checking...' : 'Check'}
              </button>
            </div>
          </form>
        </div>
        <DuplicateModal
          onClose={()=>setIsDuplicateModal(false)}
          isOpen={isDuplicateModal}
          />
        <NoDuplicateModal
          onClose={()=>setIsNotDuplicateModal(false)}
          isOpen={isNotDuplicateModal}
          />
      </div>
    )
  }

export default DuplicateUploadProfileCheck