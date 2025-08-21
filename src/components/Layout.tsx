import React, { useEffect, useRef } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, LogOut, SettingsIcon, User } from 'lucide-react';
import AppSidebar from './sidebar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Layout = () => {
  const [selectedCompany, setSelectedCompany] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropDownref = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropDownref.current && !dropDownref.current.contains(event?.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    }
  }, [dropDownref])

  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full border">
        {/* Sidebar */}
        <AppSidebar />

        {/* Content */}
        <SidebarInset className="flex flex-col flex-1">
          {/* Header */}
          <div className='flex flex-row-reverse justify-between'>
            <header className="flex flex-1 items-center justify-end px-4 h-16 border-b bg-white shadow-sm relative">


              <div className="flex items-center gap-4">
                <button
                  className="relative p-2 rounded-full hover:bg-gray-100 transition"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6 text-gray-600 hover:text-gray-900 transition" />
                  <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                <Avatar className="h-10 w-10 border border-gray-300 hover:scale-105 transition-transform duration-200 cursor-pointer" ref={dropDownref} onClick={() => setIsOpen(!isOpen)}>
                  <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              {isOpen && (
                <div
                  className="absolute right-0 top-12 mt-2 w-52 rounded-lg bg-white shadow-lg transition-all duration-200 transform origin-top scale-100 z-100" onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2" onClick={() => {
                      navigate("/profile")
                      setIsOpen(false);
                    }}>
                      <User className="h-4 w-4 text-gray-500" /> Profile
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2" onClick={() => {
                      navigate("/settings")
                      setIsOpen(false);
                    }}>
                      <SettingsIcon className="h-4 w-4 text-gray-500" /> Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2" onClick={() => {
                      localStorage.removeItem("isAuthenticated")
                      navigate("/login")
                      setIsOpen(false);
                    }}>
                      <LogOut className="h-4 w-4 text-gray-500" /> Logout
                    </button>
                  </div>
                </div>
              )}

            </header>
            <div className="flex items-center sm:hidden bg-gray-300">
              <SidebarTrigger className="mr-2 border border-white" />
            </div>
          </div>

          <main className="flex-1 p-4">
            <Outlet context={{ selectedCompany, setSelectedCompany }} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
