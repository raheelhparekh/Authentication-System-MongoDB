import React from "react";
import apiClient from "../../service/apiClient";
import { useNavigate } from "react-router-dom";

function Forgotpassword() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // make an api call to backend with data
    // get response from backend
    // take actions

    try {
      console.log("trying todo forgot password");
      const data = await apiClient.forgotPassword(email);
      console.log("data from forgot password", data);

      if (data.success) {
        console.log("forgot password success");
        // redirect to login page
        navigate("/login");
      } else {
        setError(data.message || "Forgot password failed");
      }
    } catch (error) {
      console.log("error in forgot password", error);
      setError(error.message || "Forgot password failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-orange-950 to-black px-4">
      <div className="w-full max-w-md bg-black/70 backdrop-blur-md p-8 rounded-xl  border-orange-500 shadow-[0_20px_60px_rgba(255,102,0,0.3)] transition-all duration-500 hover:shadow-orange-500/50">
        <h1 className="text-3xl font-bold text-center text-orange-400 mb-4 animate-typing overflow-hidden whitespace-nowrap border-r-4 border-orange-400 pr-5">
          Forgot Your Password?
        </h1>
        <p className="text-orange-200 text-center mb-6">No worries, we’ll help you reset it</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-orange-200">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-orange-200 bg-black text-orange-100 placeholder-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 focus:shadow-orange-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-orange-700 text-orange-200 font-semibold rounded-md transition duration-300 hover:from-orange-400 hover:to-orange-600 hover:shadow-orange-500/40"
          >
            {loading ? "Loading..." : "Send Reset Link"}
          </button>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default Forgotpassword;
