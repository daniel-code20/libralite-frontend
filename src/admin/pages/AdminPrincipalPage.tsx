import React from "react";
import AdminSideBar from "../components/AdminSideBar";
import { AdminSearchBar } from "../components/AdminSearchBar";
import { AllCategoriesAdmin } from "../components/AllCategoriesAdmin";

export const AdminPrincipalPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <div className="flex-grow flex flex-col transition-all duration-300">
        <header className="bg-white shadow-md flex items-center justify-between p-4 sticky top-0 z-10 lg:ml-60">
          <AdminSideBar />
          <AdminSearchBar />
        </header>
        <main className="flex-grow p-4 overflow-y-auto lg:ml-60">
          <AllCategoriesAdmin />
        </main>
      </div>
    </div>
  );
};
