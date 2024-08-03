import React, { useState } from 'react';
import { ActiveSlider, CategoryCard, SearchBar } from '../components';
import SideBar from '../components/SideBar';
import { FaBars, FaTimes } from 'react-icons/fa';

export const PrincipalPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-grow flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'} lg:ml-60`}>
        <header className="bg-white shadow-md flex items-center justify-between p-4 relative rounded-md ml-4 mr-4 z-10">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? (
              <FaTimes className="h-6 w-6 text-black" />
            ) : (
              <FaBars className="h-6 w-6 text-black" />
            )}
          </button>
          <SearchBar />
        </header>
        <main className="flex-grow p-4 overflow-x-auto"> {/* Cambiado overflow-y-auto a overflow-x-auto */}
          <div className="w-full"> {/* Asegura que el slider tenga ancho completo */}
            <ActiveSlider />
          </div>
          <CategoryCard />
        </main>
      </div>
    </div>
  );
};
