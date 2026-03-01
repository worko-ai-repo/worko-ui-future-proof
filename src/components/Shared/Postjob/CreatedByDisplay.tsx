import { JobData } from "@Interfaces/CorporateDashboard.dto";
import httpServiceObj from "@Services/ApiHandler.service";
import { fetchAuthSession } from "aws-amplify/auth";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@Context/App.context";
interface UserData {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  // Add other user properties as needed
}

export interface CreatedByDisplayProps<
  T extends object = {
    createdByUserId?: string;
    createdByCorporateUserId?: string;
    updatedByUserId?: string;
    updatedByCorporateUserId?: string;
  }
> {
  row: T;
  mode?: "created" | "updated";
}

const CreatedByDisplay = <
  T extends {
    createdByUserId?: string;
    createdByCorporateUserId?: string;
    updatedByUserId?: string;
    updatedByCorporateUserId?: string;
    updatedByAgencyUserId?:string;
    createdByAgencyUserId?:string;
  }
>({
  row,
  mode = "created",
}: CreatedByDisplayProps<T>) => {
  const [userData, setUserData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {userDetails} = useAppContext();

  useEffect(() => {
    const fetchUserData = async () => {
      let userId = "";
      let corporateUserId = "";
      let agencyUserId = "";

      if (mode === "created") {
        userId = row?.createdByUserId || "";
        corporateUserId = row?.createdByCorporateUserId || "";
        agencyUserId = row?.createdByAgencyUserId || "";
      } else if (mode === "updated") {
        userId = row?.updatedByUserId || "";
        corporateUserId = row?.updatedByCorporateUserId || "";
        agencyUserId = row?.updatedByAgencyUserId || "";
      }

      if (!corporateUserId && !userId && !agencyUserId) {
        throw new Error("No user ID found for display");
      }

      setLoading(true);
      try {
        // let url = "";

        // if (corporateUserId) {
        //   url = `/corporate-user/${corporateUserId}`;
        // } else if (userId) {
        //   url = `/user/${userId}/detail`;
        // } else if(agencyUserId) {
        //   url = `/user/${agencyUserId}/detail`;
        // }
        
        // const { response, error } = await httpServiceObj.get<UserData[]>(
        //   url,
        //   true,
        //   {},
        //   false,
        //   "BASE"
        // );
        // if (!response?.length || error) {
        //   throw new Error("Failed to fetch user data");
        // }

        // //Construct display name
        // if(agencyUserId){

        // }
        // const displayName = response?.[0].firstName
        //   ? `${response?.[0].firstName} ${response?.[0].lastName || ""}`.trim()
        //   : response?.[0].name || response?.[0].id;
        // setUserData(displayName);
        if(!userDetails) throw new Error("Failed to fetch user data");
        const displayName = userDetails.fullName
        setUserData(displayName);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [
    row?.createdByCorporateUserId,
    row?.createdByUserId,
    row?.updatedByCorporateUserId,
    row?.updatedByUserId,
    mode,
  ]);

  if (loading) return <div>Loading...</div>;
  if (!userData) return <div>No user data</div>;

  return <div>{userData}</div>;
};

export default CreatedByDisplay;
