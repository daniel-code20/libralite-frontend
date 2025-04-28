import React, { useState } from 'react';
import AdminSideBar from '../components/AdminSideBar';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AdminSearchBar } from '../components/AdminSearchBar';
import { AllCategoriesAdmin } from '../components/AllCategoriesAdmin';

export const AdminPrincipalPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <AdminSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-grow flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'} lg:ml-60`}>
        <header className="bg-white shadow-md flex items-center justify-between p-4 relative z-10">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? (
              <FaTimes className="h-6 w-6 text-black" />
            ) : (
              <FaBars className="h-6 w-6 text-black" />
            )}
          </button>
          <AdminSearchBar />
        </header>
        <main className="flex-grow p-4 overflow-y-auto">
          <AllCategoriesAdmin/>
        </main>
      </div>
    </div>
  );
};
