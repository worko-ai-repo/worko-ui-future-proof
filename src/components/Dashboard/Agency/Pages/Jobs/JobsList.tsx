import SearchBar from '@Components/Shared/SearchBar'
import SkeletonLoader from '@Components/Shared/SkeletonLoader'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import GenericDropdownAgency from '@Components/Shared/DropDown/GenericDropdownAgency'
import SearchBarAgency from '@Components/Shared/SearchBarAgency'
import JobsListTable from './JobsListTable'
import httpServiceObj from '@Services/ApiHandler.service'
import { useAppContext } from '@Context/App.context';
import { AgencyJobsList } from '@Interfaces/AgencyDashboardList.dto'
import { AgencyListApiResponse } from '../Invites/InvitesList'

export interface JobListFilters {
  searchText?: string;
  companyId?: string;
  sortOrder?: "ascending" | "descending";
  userType?: string;
}
export interface JobsListApiResponse {
  data: AgencyJobsList[];
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

const initialPaginationState: PaginationInfo = {
  count: 0,
  pageSize: 10,
  sortOrder: "descending",
  timesQueried: 0,
  queriedCount: 0,
  lastKey: "",
};

const JobsList = () => {
  const [searchBarText,setSearchBarText] = useState<string|null>("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  const [filters, setFilters] = useState<JobListFilters>({});
  const [pageSize,setPageSize] = useState<number>(10);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [fetchData,setFetchData] = useState<any>(null);
  const [paginationInfo, setPaginationInfo] = useState(initialPaginationState);
  const [currentPage, setCurrentPage] = useState(1);
  const paginationKeysRef = useRef<Record<number, string>>({1: "",});

  const [isCompanyLoading,setIsCompanyLoading] = useState<boolean>(false);
  const [companyFilter,setCompanyFilter] = useState<any>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [companyList, setCompanyList] = useState<any[]>([]);
  // const [companyList, setCompanyList] = useState<any[]>([
  //   {
  //     label: "All",
  //     onClick: () => {
  //       setCompanyFilter("All");
  //       setSelectedCompanyId("");
  //       setCurrentPage(1);
  //       setPaginationInfo(prev => ({ ...prev, lastKey: "" }));
  //     },
  //   },
  // ]);

  const { userDetails } = useAppContext();
  const [jobsList,setJobsList] = useState([]);

    const fetchJobsData = useCallback(
      async (
        page: number = 1,
        size: number = pageSize,
        lastKey: string = "",
        searchFilters = filters,
        isSearch = false,
        sortOrder = "desc",
        selectedCompanyId = "",
      ) => {
        if (!userDetails?.email) return;
    
        setIsLoading(true);
        try {
          const url = `/agency-job-assignment/`;
          const params: Record<string, any> = {
            agencyRegisteredEmail: userDetails?.email,
            status: "ACTIVE",
            includeJobDetails: true,
            pageSize:size,
            lastKey,
            sortOrder,
          }
          if (selectedCompanyId) params.companyId = selectedCompanyId;
          const { response } = await httpServiceObj.get<JobsListApiResponse>(url, true, params, false,"BASE");
    
          if (response) {
            setFetchData(response.data);
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
        }
      },
      [userDetails, pageSize, filters]
    );
  
    const fetchCompanyData = async() => {
      if (!userDetails?.email) return;
      setIsCompanyLoading(true)
      try {
        const url = `/agency-invite/`;
        const params = {
          agencyEmail: userDetails?.email,
          inviteStatus: "ACCEPTED",
          includeCompanyDetails: true,
          includeInvitedOwnerDetails: true,
          pageSize:200,
        }
        const { response } = await httpServiceObj.get<AgencyListApiResponse>(url, true, params, false,"BASE");
  
        if (response && Array.isArray(response.data)) {
          setCompanyList([
            {
              label: "All",
              onClick: () => {
                setCompanyFilter("All");
                setSelectedCompanyId("");
                setCurrentPage(1);
                setPaginationInfo(prev => ({ ...prev, lastKey: "" }));
              },
            },
          ]);
          const companyOptions = response.data.map((company: any) => {
          const title = company.companyName;
          const label = `${title}` 
          const id = company.companyId;
          return {
            label,
            onClick: () => {
              setCompanyFilter(label);
              setSelectedCompanyId(id ?? "");
              setCurrentPage(1);
              setPaginationInfo(prev => ({ ...prev, lastKey: "" }));
              paginationKeysRef.current = { 1: "" };
            },
          raw: company,
        };
      });

    setCompanyList(prev => [prev[0], ...companyOptions]);
        } else {
          console.error("Cannot fetch user details");
        }
      } catch (err) {
        console.error("Exception in fetchReferrals:", err);
      } finally {
        setIsCompanyLoading(false);
      }
    }

    useEffect(() => {
      fetchCompanyData()
    }, [userDetails])
    
    useEffect(() => {
      if (userDetails?.email) {
        setCurrentPage(1);
        setPaginationInfo((prev) => ({ ...prev, lastKey: "" }));
        paginationKeysRef.current = { 1: "" };
          fetchJobsData(1, pageSize, "", filters, false, "desc", selectedCompanyId)
        // fetchJobs()
      }
    }, [userDetails, fetchJobsData, pageSize, selectedCompanyId]);
      
    const searchInputRef = useRef<NodeJS.Timeout | null>(null);
  
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchBarText(e.target.value);
    };

    const handlePageChange = useCallback((page: number) => {
        const lastKey = paginationKeysRef.current[page] || "";
        
        setCurrentPage(page);
        fetchJobsData(page, pageSize, lastKey);
      },
      [fetchJobsData, pageSize]
    );
  
  
    const handlePageSizeChange = useCallback(
      (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
        setPaginationInfo((prev) => ({ ...prev, lastKey: "" }));
        paginationKeysRef.current = { 1: "" };
        fetchJobsData(1, size, "");
      },
      [fetchJobsData]
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
      <div className='flex flex-row gap-2 justify-center items-center '>
        {/* Dropdown 1 */}
          <div className="flex gap-3 font-semibold w-full sm:w-auto">
            <GenericDropdownAgency
              selectTitle={"Select Company"}
              tooltipMessage="Select Company to filter"
              disabled={false}
              options={companyList}
              isJobsLoading={isCompanyLoading}
              editable={false}
            />
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
              <JobsListTable
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

export default JobsList
