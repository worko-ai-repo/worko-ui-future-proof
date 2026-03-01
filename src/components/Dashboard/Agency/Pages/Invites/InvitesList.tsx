import SkeletonLoader from '@Components/Shared/SkeletonLoader'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import InvitesListTable from './InvitesListTable'
import httpServiceObj from '@Services/ApiHandler.service';
import { useAppContext } from '@Context/App.context';
import { AgencyInvitesListDetailsDto } from '@Interfaces/AgencyDashboardList.dto';

export interface InviteListFilters {
  searchText?: string;
  companyId?: string;
  sortOrder?: "ascending" | "descending";
  userType?: string;
}

export interface AgencyListApiResponse {
  data: AgencyInvitesListDetailsDto[];
  pagination: PaginationInfo;
  totalReferrals?: number;
  currentPage?: number;
  totalPages?: number;
  matchingScore?: number;
}

export interface PaginationInfo {
  count: number;
  pageSize: number;
  sortOrder: string;
  timesQueried: number;
  queriedCount: number;
  lastKey: string;
}

// export interface AgencyInvitesListDetailsDto {
//   GSTIN: string;
//   companyId: string;
//   contractCopyUserFileName: string;
//   createdAt: string;
//   email: string; 
//   id: string;
//   inviteStatus: string;
//   invitedByCorporateUserId: string;
//   name: string;
//   phoneNumberDetails: {
//     number: number; 
//     countryCode: number;
//   }
//   updatedAt: string;
//   updatedByAgencyUserId: string; 
// }

const initialPaginationState: PaginationInfo = {
  count: 0,
  pageSize: 10,
  sortOrder: "descending",
  timesQueried: 0,
  queriedCount: 0,
  lastKey: "",
};

const InvitesList = () => {
  const [searchBarText,setSearchBarText] = useState<string|null>("")
  // const [queryIsJobsLoading,setQueryIsJobsLoading] = useState<boolean>(false)
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [pageSize,setPageSize] = useState<number>(10);
  const [filters, setFilters] = useState<InviteListFilters>({});
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [fetchData,setFetchData] = useState<any>(null);
  const [paginationInfo, setPaginationInfo] = useState(initialPaginationState);
  const [currentPage, setCurrentPage] = useState(1);
  const paginationKeysRef = useRef<Record<number, string>>({1: "",});
  const { userDetails } = useAppContext();
  const [jobsList,setJobsList] = useState([]);

  //   useEffect(() => {
  //   const getInvitesList = async()=>{
  //   const params = {
  //   agencyEmail: userDetails?.email,
  //   // inviteStatus: "AWAITING",
  //   includeCompanyDetails: true,
  //   includeInvitedOwnerDetails: true
  // }
  //     try {
  //       const {response} = await httpServiceObj.get<any>(`/agency-invite/`,true,params,false,"BASE")
  //       console.log(response)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   getInvitesList()
  // }, [])

  const fetchUserData = useCallback(
    async (
      page: number = 1,
      size: number = pageSize,
      lastKey: string = "",
      searchFilters = filters,
      isSearch = false,
      sortOrder = "desc"
    ) => {

      if (!userDetails?.email) return;
  
      setIsLoading(true);
      try {
        const url = `/agency-invite/`;
        const params = {
          agencyEmail: userDetails?.email,
          // inviteStatus: "AWAITING",
          includeCompanyDetails: true,
          includeInvitedOwnerDetails: true,
          pageSize:size,
          lastKey,
          sortOrder,
        }
        const { response } = await httpServiceObj.get<AgencyListApiResponse>(url, true, params, false,"BASE");
  
        if (response) {
          setFetchData(response.data);
          // console.log(response)
          if (response.pagination) {
            setPaginationInfo(response.pagination);
  
            if (isSearch || page === 1) {
              paginationKeysRef.current = { 1: "" };
              if (response.pagination.lastKey) {
                paginationKeysRef.current[2] = response.pagination.lastKey;
              }
            } else if (response.pagination.lastKey) {
              paginationKeysRef.current[page + 1] = response.pagination.lastKey;
            }
          }
        } else {
          console.error("Cannot fetch user details");
        }
      } catch (err) {
        console.error("Exception in fetchReferrals:", err);
      } finally {
        setIsLoading(false);
        // setFetchData(agencyDetailsList.data)
        // setPaginationInfo(agencyDetailsList.pagination)
      }
    },
    [userDetails, pageSize, filters]
  );

  //   const fetchJobs = async() =>{
  //   const params = {
  //   agencyEmail: userDetails?.email,
  //   // inviteStatus: "AWAITING",
  //   includeCompanyDetails: true,
  //   includeInvitedOwnerDetails: true
  // }

  //   try {
  //     const {response} = await httpServiceObj.get<any>(`/agency-invite/`,true,params,false,"BASE")
  //     if(response?.data){
  //       setJobsList(response.data)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  
  useEffect(() => {
    // console.log(userDetails)
      if (userDetails?.email) {
        setCurrentPage(1);
        setPaginationInfo((prev) => ({ ...prev, lastKey: "" }));
        paginationKeysRef.current = { 1: "" };
        fetchUserData(1, pageSize, "");
        // fetchJobs()
      }
    }, [userDetails, fetchUserData, pageSize]);
  
      const searchInputRef = useRef<NodeJS.Timeout | null>(null);
    
      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchBarText(e.target.value);
      };

          const handlePageChange = useCallback((page: number) => {
              const lastKey = paginationKeysRef.current[page] || "";
              
              setCurrentPage(page);
              fetchUserData(page, pageSize, lastKey);
            },
            [fetchUserData, pageSize]
          );
        
        
          const handlePageSizeChange = useCallback(
            (size: number) => {
              setPageSize(size);
              setCurrentPage(1);
              setPaginationInfo((prev) => ({ ...prev, lastKey: "" }));
              paginationKeysRef.current = { 1: "" };
              fetchUserData(1, size, "");
            },
            [fetchUserData]
          );
      
        const removeAgencyLocally = (id: string) => {
          setFetchData((prev:any) => prev?.filter((item:any) => item.id !== id));
        };

  const toggleRow = (row: any) => {
      setSelectedRows((prev) =>
        prev.some((r) => r.id === row.id)
          ? prev.filter((r) => r.id !== row.id)
          : [...prev, row]
      );
    };

  const toggleSelectAll = (rows: any[]) => {
    if (selectedRows.length === rows.length) setSelectedRows([]);
    else setSelectedRows(rows);
  };

  const getAllSelected = (rows: any[]) => selectedRows.length === rows.length;
  const reset = () => setSelectedRows([]);
  
  const refetch = () => {};
  const handleJobApplicationStatusUpdate = () => {};
  const handleSendToRecruiter = () => {};
  const onBulkUpdate = () => {};

  const ListSelection = {
    selectedRows,
    toggleSelectAll,
    toggleRow,
    getAllSelected,
    reset,
  };
    const handleLocalUpdate = useCallback((jobId: string, updatedData: any) => {
      setFetchData((prevData:any) => {
      if (!prevData || !Array.isArray(prevData)) return prevData;
  
      return prevData.map(job =>
        job.id === jobId ? { ...job, ...updatedData } : job
      );
    });
    }, []);
  return (
        <div>
    <div className='flex flex-row gap-2 justify-center items-center'>
    </div>

      <div className="flex flex-col sm:flex-col gap-4 sm:gap-[35px]">
        <div className="flex flex-row justify-end items-center">
          <div className="flex flex-wrap gap-4">
          </div>
           {/* Search Bar */}
            {/* <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <SearchBar
                searchBarText={searchBarText}
                setSearchBarText={setSearchBarText}
                handleClick={() => console.log("as")}
                />
            </div> */}
        </div>
      </div>
      <br />
      {isLoading ? (
        <SkeletonLoader
            showTableHeader={true}
            showTableRows={true}
            tableColumns={5}
            rowCount={5}
        />
        ) : (
        <InvitesListTable
          data={fetchData}
          userType="AGENCY"
          refetch={refetch}
          ListSelection={ListSelection}
          handleUpdate={handleJobApplicationStatusUpdate}
          sendApplicationToRecruiter={handleSendToRecruiter}
          isBulkEvaluation={!!selectedRows.length}
          onBulkUpdate={onBulkUpdate}
          localUpdate={handleLocalUpdate}
          removeAgencyLocally={removeAgencyLocally}
          pagination={paginationInfo}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          jobsList={jobsList}
        />
      )}
    </div>
  )
}

export default InvitesList