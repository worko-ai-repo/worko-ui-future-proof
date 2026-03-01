import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@Layouts/Main-Layout/MainLayout";
import PageNotFound from "@Pages/errors/404/PageNotFound";
import MainLoader from "@Components/Loader/Loader";
import ErrorFallback from "@Pages/errors/base-error/ErrorFallback";
import FAQ from "@Pages/faq/Faq";

import JobDescription from "@Pages/JobDescriptionPage";
import ProtectedRoute from "@Services/SessionValidator.service";
import { UserRole } from "@Interfaces/RoleBasedAccessControl";
import NewHeroIntro from "@Components/Hero/NewHeroIntro";


// Lazy Load Components
const Hero = lazy(() => import("@Pages/hero/Hero"));
const About = lazy(() => import("@Pages/About/About"));
const Company = lazy(() => import("@Pages/company/Company"));
const Employee = lazy(() => import("@Pages/employee/Employee"));
const Guidance = lazy(() => import("@Pages/guidance/Guidance"));
const AuthRouter = lazy(() => import("@Pages/Auth/Auth.router"));
const Corporate = lazy(() => import("@Pages/corporate/Corporate"));
const DashboardRouter = lazy(() => import("@Pages/Dashboard/Dashboard.router"));
const RequestReferral = lazy(() => import("@Pages/request-referral/RequestReferral"));
const CorporateConnect = lazy(() => import("@Pages/corporate/corporateConnect/CorporateConnect"));
const TermsOfUse = lazy(() => import("@Pages/terms/TermsOfUse"));
const PrivacyPolicy = lazy(() => import("@Pages/privacy-policy/PrivacyPolicy"));
const ContactUs = lazy(() => import("@Pages/contact-us/ContactUs"));
const UnderConstruction = lazy(() => import("@Pages/errors/under-constuction/UnderConstruction"));
const JobRecommendationForm = lazy(() => import("@Components/Auth/PostSignupForm"));
const WorkoFutureProof = lazy(() => import("@Components/Dashboard/WorkoFutureProofLanding/WorkoFutureProofLanding"));
const underConstructionPaths = [
  "faqs",
  "blogs",
  "pricing",
  "employee/*",
  "candidate/*",
  "profile/*",
  "support",
];

// Create routes for under construction pages
const underConstructionRoutes = underConstructionPaths.map((path) => ({
  path,
  element: (
    <Suspense fallback={<MainLoader />}>
      <UnderConstruction />
    </Suspense>
  ),
}));

// Route Configuration
const AppRoutes = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <Suspense fallback={<MainLoader />}>
          {/* @TODO add protected route */}
          {/* <ProtectedRouteAgency requiredRoles={[UserRole.AGENCY]} element={<DashboardRouter />}/> */}
          <WorkoFutureProof />
        </Suspense>
      ),
    },
    { path: "*", element: <PageNotFound /> }
  ],
  //uncomment below to run in local
  // {
  //   ...(import.meta.env.APP_MODE != "STAGING" ? {} : {basename: "/v0/" }),
  // }
  // {
  //   ...(import.meta.env.APP_MODE != "DEVELOPMENT" ? {} : { basename: "/v0/" }),
  // }
);
export default AppRoutes;
