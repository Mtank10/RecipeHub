import { useState,useEffect } from "react";
import Loader from "../components/Loader";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    
    <div className="flex flex-col ">
      {/* Sidebar stays visible on all pages */}
      {isLoading ? <Loader /> : (
        <>
          <Sidebar />

          {/* Main content (changes based on routes) */}
          <div className="ml-[250px]">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
