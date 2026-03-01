
import Sidebar from '@Components/Dashboard/Sidebar';
import Header from '@Components/Dashboard/Header';
import { AppProvider } from '@Context/App.context';
import { DashboardProvider } from '@Context/Dashboard.context';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

function CorporateDashboardLayout(): JSX.Element {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr]">
            <AppProvider>
            <DashboardProvider>
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
                
                <div className="overflow-auto grid grid-rows-[auto_1fr] h-screen no-scrl-web">
                    <Header
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    <main className=" p-0 lg:py-0 lg:px-4 w-full max-w-full min-w-0">
                        <Outlet />
                    </main>
                </div>
            </DashboardProvider>
            </AppProvider>
        </div>
    );
}

export default CorporateDashboardLayout;
