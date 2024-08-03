import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { logoutUser } from '../auth/authUser';
import logoImg from '../assets/Logo1.png';
import { Button } from '@nextui-org/button';
import { FaHome, FaShoppingCart, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';

const SideBar: React.FC<{ sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }> = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <aside className={`fixed top-0 left-0 h-full w-60 bg-white shadow-md transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-60`}>
      <div className="h-full flex flex-col justify-between px-6 py-4">
        <div>
          <div className="flex items-center">
            <img src={logoImg} alt="Logo" className="h-8" />
            <h1 className="font-bold bg-gradient-to-tr from-blue-500 to-cyan-400 text-transparent bg-clip-text ml-2">
              LibraLite
            </h1>
          </div>
          <nav className="flex flex-col space-y-4 mt-10">
            <Link to={'/principal'} className={`flex items-center p-2 rounded-md ${isActive('/principal') ? 'bg-blue-100' : ''}`}>
              <FaHome className={`mr-3 ${isActive('/principal') ? 'text-blue-500' : 'text-gray-500'}`} />
              <h1 className={`text-black ${isActive('/principal') ? 'font-semibold text-blue-500' : ''}`}>
                Principal
              </h1>
            </Link>
            <Link to={'/buyslist'} className={`flex items-center p-2 rounded-md ${isActive('/buyslist') ? 'bg-blue-100' : ''}`}>
              <FaShoppingCart className={`mr-3 ${isActive('/buyslist') ? 'text-blue-500' : 'text-gray-500'}`} />
              <h1 className={`text-black ${isActive('/buyslist') ? 'font-semibold text-blue-500' : ''}`}>
                Compras
              </h1>
            </Link>
            <Link to={'/reservationlist'} className={`flex items-center p-2 rounded-md ${isActive('/reservationlist') ? 'bg-blue-100' : ''}`}>
              <FaCalendarAlt className={`mr-3 ${isActive('/reservationlist') ? 'text-blue-500' : 'text-gray-500'}`} />
              <h1 className={`text-black ${isActive('/reservationlist') ? 'font-semibold text-blue-500' : ''}`}>
                Reservaciones
              </h1>
            </Link>
          </nav>
        </div>
        <Button
          onClick={handleLogout}
          className="text-black mt-auto mb-4 font-semibold flex items-center justify-start bg-white"
          radius="sm"
          variant='light'
        >
          <FaSignOutAlt className="mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
};

export default SideBar;
