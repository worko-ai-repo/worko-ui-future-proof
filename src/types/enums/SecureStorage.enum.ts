/**
 * enum for SecureStorageKeyDto
 *
 * @description This is an enum for Secure Storage. All the properties of SecureStorageKeyDto are optional. And should
 *  be used to define the structure of SecureStorageKeyDto. This will store all the Key related to SecureStorage.
 * @enum SecureStorageKeyEnum
 */
export enum SecureStorageKeyEnum {
	COGNITOUSERDETAILS = 'cognitoUserDetails',
	CORPORATEUSERTYPE = 'corporateUserType',
	USERTOKEN = 'userToken',
	SIGNINDETAILS = 'signinDetails',
	LOGINDETAILS = 'loginDetails',
	ISLINKEDINUSER = 'isLinkedInUser',
	USEREMAIL = 'userEmail',
	COGNITOUSERID = 'cognitoUserId',
	USERTYPE = 'userType',
	ACCESSTOKEN = 'accessToken',
	LASTACCESSEDDASH = 'lastAccessedDash',
	USERNAME = 'userName',
	LINKEDINUSERTYPE = 'linkedinUserType',
	LASTACCESSED_DASH = 'lastAccessedDash',
	IS_COMPANY_LISTING_ROUTE = 'isCompanyListingRoute',
	DYNAMIC_ROUTE = 'dynamicRoute',
	CONTINUEPENDINGPRESIGNEDPROCESS = 'continuePendingPresignedProcess',
	AUTHACTIVEFORMDATA = 'AuthActiveFormData',
	AUTHEMPSELECTEDCOMPANY = 'AuthEmpSelectedCompany',
	CORPORATECOMPANYID = 'corporateCompanyId',
	CORPORATECOMPANYDERAILS = 'corporateCompanyDetails',
	// agency
	AGENCY_ACCESSTOKEN = 'agencyAccessToken',
	AGENCY_COGNITOUSERID = 'agencyCognitoUserId',
	AGENCY_USERDETAILS = 'agencyUserDetails',
	AGENCY_USERGROUPS = 'agencyUserGroups',
}