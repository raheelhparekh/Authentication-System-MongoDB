import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../service/apiClient";

function Profile() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError("");
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile data");
        const response = await apiClient.getProfile();
        console.log("Response from getProfile", response);
        if (response.success) {
          setUser(response.user);
        } else {
          setError(response.message || "Failed to fetch profile");
        }
      } catch (error) {
        console.log("Error in fetching profile", error);
        setError(error.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-orange-950 to-black px-4">
      <div className="w-full max-w-md bg-black/70 backdrop-blur-md p-8 rounded-xl  border-orange-500 shadow-[0_20px_60px_rgba(255,102,0,0.3)] transition-all duration-500 hover:shadow-orange-500/50 text-center">
        {loading ? (
          <p className="text-orange-200">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-orange-400 mb-4 animate-typing overflow-hidden whitespace-nowrap border-r-4 border-orange-400 pr-5">
              Welcome {user?.name}
            </h1>
            <p className="text-orange-200">Email: {user?.email}</p>
            <p className="text-orange-200">Role: {user?.role}</p>
            <p className="text-orange-200">Created At: {new Date(user?.createdAt).toLocaleDateString()}</p>
            <p className="text-orange-200">Updated At: {new Date(user?.updatedAt).toLocaleDateString()}</p>
            <p className="text-orange-200"> Email verified : {user.isVerified?"Yes" :"No"}</p>
            <button
              onClick={() => {
                navigate("/logout");
              }}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-800 text-white font-semibold rounded-md transition duration-300 hover:from-orange-500 hover:to-orange-700 hover:shadow-lg"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
