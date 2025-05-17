import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Verifyemail from "./components/Verifyemail.jsx";
import Resetpassword from "./components/Resetpassword.jsx";
import Forgotpassword from "./components/Forgotpassword.jsx";
import Logout from "./components/Logout.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/api/v1/users/verify/:token" element={<Verifyemail />} />
        <Route path="/api/v1/users/reset-password/:token" element={<Resetpassword />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
