import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../service/apiClient";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        console.log("trying to logout");
        const response = await apiClient.logout();
        console.log("response from logout", response);
        if (response.success) {
          console.log("logout success");
          // redirect to login page
          navigate("/login");
        } else {
          console.log("logout failed");
        }
      } catch (error) {
        console.log("error in logout", error);
      }
    };

    logout();
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-orange-950 to-black px-4">
      <div className="w-full max-w-md bg-black/70 backdrop-blur-md p-8 rounded-xl  border-orange-500 text-center shadow-[0_20px_60px_rgba(255,102,0,0.3)] transition-all duration-500 hover:shadow-orange-500/50">
        <h1 className="text-3xl font-bold text-orange-400 animate-typing overflow-hidden whitespace-nowrap border-r-4 border-orange-400 pr-5 mb-2">
          Logging Out...
        </h1>
        <p className="text-orange-200">Please wait while we log you out.</p>
      </div>
    </div>
  );
}

export default Logout;
