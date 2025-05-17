import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../service/apiClient";
import { useNavigate } from "react-router-dom";

function Verifyemail() {
  const { token } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      setLoading(true);
      setError("");

      try {
        console.log("trying to verify email");
        const response = await apiClient.verifyEmail(token);
        console.log("response from verify email", response);
        if (response.success) {
          console.log("email verified successfully");

        } else {
          setError(response.message || "Email verification failed");
        }
      } catch (error) {
        console.log("error in email verification", error);
        setError(error.message || "Email verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-orange-950 to-black px-4">
      <div className="w-full max-w-md bg-black/70 backdrop-blur-md p-8 rounded-xl  border-orange-500 shadow-[0_20px_60px_rgba(255,102,0,0.3)] transition-all duration-500 hover:shadow-orange-500/50 text-center">
        <h1 className="text-3xl font-bold text-orange-400 mb-6 animate-typing overflow-hidden whitespace-nowrap border-r-4 border-orange-400 pr-5">
          Verifying Email
        </h1>
        {loading && <div className="text-orange-200">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <div>
            <h2 className="text-orange-200 text-xl mb-4">Email verified successfully!</h2>
            <button
              onClick={() => navigate("/")}
              className="mt-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-700 text-black font-semibold rounded-md transition duration-300 hover:from-orange-400 hover:to-orange-600 hover:shadow-orange-500/40"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Verifyemail;