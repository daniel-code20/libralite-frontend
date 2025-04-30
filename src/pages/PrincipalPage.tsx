import React, { useState } from "react";
import { SearchBar } from "../components";
import SideBar from "../components/SideBar";
import { FaBars } from "react-icons/fa";
import { AllCategories } from "../components/AllCategories";

export const PrincipalPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`flex-grow flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-60" : "ml-0"
        } lg:ml-60`}
      >
        <header className="bg-white flex items-center justify-between p-4 relative z-10">
          {!sidebarOpen && (
            <button
              className="lg:hidden text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars className="w-6 h-6" />
            </button>
          )}

          <SearchBar />
        </header>
        <main className="p-4">
          <div>{/* <ActiveSlider /> */}</div>
          <AllCategories />
        </main>
      </div>
    </div>
  );
};
