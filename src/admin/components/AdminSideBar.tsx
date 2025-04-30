import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { logoutUser } from "../../auth/authUser";
import logoImg from "../../assets/Logo1.png";
import { Button } from "@nextui-org/button";
import {
  FaHome,
  FaShoppingCart,
  FaCalendarAlt,
  FaSignOutAlt,
  FaTags,
  FaShoppingBag,
  FaBars,
} from "react-icons/fa";

const AdminSideBar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado para controlar la visibilidad del sidebar
  const sidebarRef = useRef<HTMLDivElement | null>(null); // Referencia al sidebar
  const navigate = useNavigate();
  const location = useLocation();

  // Cerrar el sidebar al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <>
      {/* Botón de apertura/cierre del sidebar en pantallas pequeñas */}
      {!sidebarOpen && (
        <button
          className="lg:hidden text-gray-700 absolute z-40 top-6 left-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars className="w-6 h-6" />
        </button>
      )}
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-60 bg-white shadow-xl z-30 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-60`}
      >
        <div className="h-full flex flex-col justify-between px-6 py-4">
          <div>
            {/* Contenedor con el logo */}
            <div className="flex items-center justify-between mb-6">
              {/* Logo */}
              <div className="flex items-center">
                <img src={logoImg} alt="Logo" className="h-8" />
                <h1 className="font-bold bg-gradient-to-tr from-blue-500 to-cyan-400 text-transparent bg-clip-text ml-2">
                  BookFlow
                </h1>
              </div>
            </div>
            {/* Enlaces del menú */}
            <nav className="flex flex-col space-y-4 mt-10">
              <Link
                to={"/admin-principal"}
                className={`flex items-center p-2 rounded-md ${
                  isActive("/admin-principal") ? "bg-blue-100" : ""
                }`}
              >
                <FaHome
                  className={`mr-3 ${
                    isActive("/admin-principal")
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                />
                <h1
                  className={`text-black ${
                    isActive("/admin-principal")
                      ? "font-semibold text-blue-500"
                      : ""
                  }`}
                >
                  Principal
                </h1>
              </Link>
              <Link
                to={"/admin-buyslist"}
                className={`flex items-center p-2 rounded-md ${
                  isActive("/admin-buyslist") ? "bg-blue-100" : ""
                }`}
              >
                <FaShoppingCart
                  className={`mr-3 ${
                    isActive("/admin-buyslist")
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                />
                <h1
                  className={`text-black ${
                    isActive("/admin-buyslist")
                      ? "font-semibold text-blue-500"
                      : ""
                  }`}
                >
                  Compras
                </h1>
              </Link>
              <Link
                to={"/admin-reservationlist"}
                className={`flex items-center p-2 rounded-md ${
                  isActive("/admin-reservationlist") ? "bg-blue-100" : ""
                }`}
              >
                <FaCalendarAlt
                  className={`mr-3 ${
                    isActive("/admin-reservationlist")
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                />
                <h1
                  className={`text-black ${
                    isActive("/admin-reservationlist")
                      ? "font-semibold text-blue-500"
                      : ""
                  }`}
                >
                  Reservaciones
                </h1>
              </Link>
              <Link
                to={"/admin-categories"}
                className={`flex items-center p-2 rounded-md ${
                  isActive("/admin-categories") ? "bg-blue-100" : ""
                }`}
              >
                <FaTags
                  className={`mr-3 ${
                    isActive("/admin-categories")
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                />
                <h1
                  className={`text-black ${
                    isActive("/admin-categories")
                      ? "font-semibold text-blue-500"
                      : ""
                  }`}
                >
                  Categorías
                </h1>
              </Link>
              <Link
                to={"/admin-sucursal"}
                className={`flex items-center p-2 rounded-md ${
                  isActive("/admin-sucursal") ? "bg-blue-100" : ""
                }`}
              >
                <FaShoppingBag
                  className={`mr-3 ${
                    isActive("/admin-sucursal")
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                />
                <h1
                  className={`text-black ${
                    isActive("/admin-sucursal")
                      ? "font-semibold text-blue-500"
                      : ""
                  }`}
                >
                  Sucursales
                </h1>
              </Link>
            </nav>
          </div>
          <Button
            onClick={handleLogout}
            className="text-black mt-auto mb-4 font-semibold flex items-center justify-start bg-white"
            radius="sm"
            variant="light"
          >
            <FaSignOutAlt className="mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </aside>
    </>
  );
};

export default AdminSideBar;
