// resources/js/Pages/Dashboard/Components/Layout.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen min-w-fit bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* ✅ Global Topbar */}
                <Topbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto bg-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
