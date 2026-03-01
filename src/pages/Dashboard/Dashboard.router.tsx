import { Route, Routes, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLoader from '@Components/Loader/Loader';
import { AppProvider } from '@Context/App.context';
import DashboardLayout from '@Layouts/Main-Layout/Dashboard.layout';
import ApplicantScreeningTable from '@Components/Shared/BulkCvPage/BulkCvApplicants';
// import Applicants from '@Components/Dashboard/Corporate/Applicants/Applicants';

const PageNotFound = lazy(() => import('@Pages/errors/404/PageNotFound'));
const CorporateDashboard = lazy(() => import('@Components/Dashboard/Corporate/Job/Jobs'));

const Invites = lazy(() => import("@Components/Dashboard/Agency/Pages/Invites/InvitesList"));
const Jobs = lazy(() => import("@Components/Dashboard/Agency/Pages/Jobs/JobsList"));
const Applicants = lazy(() => import("@Components/Dashboard/Agency/Pages/Applicants/ApplicantsList"));
const BulkCVCheck = lazy(() => import("@Components/Dashboard/Agency/Pages/BulkCVCheck/BulkCvCheck"));
const Credits = lazy(() => import("@Components/Dashboard/Agency/Pages/Credits/Credits"));

const Dashboard = () => {
    return (
        <AppProvider>
            <Suspense fallback={<MainLoader />}>
                <Routes>
                    {/* <Route path="/corporate" element={<DashboardLayout />}>
                        <Route index element={<Navigate to="jobs" replace />} />
                        <Route path="home" element={<CorporateDashboard />} />
                        <Route path="jobs" element={<CorporateDashboard />} />
                        <Route path="applicants" element={<Applicants />} />
                        <Route path="bulk-cv-check" element={<CorporateDashboard />} />
                        <Route path="invites" element={<CorporateDashboard />} />
                        <Route path="referrals" element={<CorporateDashboard />} />
                        <Route path="support" element={<CorporateDashboard />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Route> */}

                    <Route path="/agency" element={<DashboardLayout />}>
                        <Route 
                        index 
                        element={
                            <Suspense fallback={<MainLoader />}>
                                <Navigate to="aginvites" replace />
                            </Suspense>
                            } 
                        />
                        <Route
                            path="aginvites"
                            element={
                                <Suspense fallback={<MainLoader />}>
                                    <Invites />
                                </Suspense>
                            }
                        />
                        <Route
                            path="agJobs"
                            element={
                                <Suspense fallback={<MainLoader />}>
                                    <Jobs />
                                </Suspense>
                            }
                        />
                        <Route
                            path="agApplicants"
                            element={
                                <Suspense fallback={<MainLoader />}>
                                    <Applicants />
                                </Suspense>
                            }
                        />
                        <Route
                            path="agBulkCVCheck"
                            element={
                                <Suspense fallback={<MainLoader />}>
                                    <BulkCVCheck />
                                </Suspense>
                            }
                        />
                        <Route
                            path="agBulkCVCheck/listing/:id"
                            element={
                                <Suspense fallback={<MainLoader />}>
                                    <ApplicantScreeningTable />
                                </Suspense>
                            }
                        />
                        <Route
                            path="agCredits"
                            element={
                                <Suspense fallback={<MainLoader />}>
                                    <Credits />
                                </Suspense>
                            }
                        />
                        <Route path="*" element={<PageNotFound />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Suspense>
        </AppProvider>
    );
};

export default Dashboard;
