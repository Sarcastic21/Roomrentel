import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "User",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const sendOtp = async () => {
    if (!formData.email) return alert("Please enter your email.");
    setLoadingOtp(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;    
      const response = await fetch(`${apiBaseUrl}/users/send-otp2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setOtpSent(true);
        alert("OTP sent to your email.");
      } else {
        alert("Failed to send OTP. Try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Something went wrong.");
    } finally {
      setLoadingOtp(false);
    }
  };

  const verifyOtp = async () => {
    setLoadingVerify(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;    
      const response = await fetch(`${apiBaseUrl}/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      if (response.ok) {
        setIsOtpVerified(true);
        alert("OTP verified successfully.");
      } else {
        alert("Invalid OTP. Try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) return alert("Please verify the OTP first.");

    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL; // Retrieve the API base URL from environment variables
    
      const response = await fetch(`${apiBaseUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        const redirectTo = data.user.role === "User" ? "/user-dashboard" : "/broker-dashboard";
        navigate(redirectTo);
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container bg-gray-50 min-h-screen flex items-center justify-center py-6">
        <div className="login-form bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Mobile No"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full border p-2 rounded"
            />

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="Broker"
                  checked={formData.role === "Broker"}
                  onChange={() => handleRoleChange("Broker")}
                />
                Broker
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="User"
                  checked={formData.role === "User"}
                  onChange={() => handleRoleChange("User")}
                />
                User
              </label>
            </div>

            {otpSent && !isOtpVerified && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <button
                  type="button"
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  onClick={verifyOtp}
                  disabled={loadingVerify}
                >
                  {loadingVerify ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}

            {!otpSent && (
              <button
                type="button"
                className="w-full bg-[#FF6B6B] text-white py-2 rounded hover:bg-red-500"
                onClick={sendOtp}
                disabled={loadingOtp}
              >
                {loadingOtp ? "Sending..." : "Send OTP to Email"}
              </button>
            )}

            {isOtpVerified && (
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Register
              </button>
            )}
          </form>

          <div className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <span
              className="text-[#FF6B6B] cursor-pointer"
              onClick={() => navigate("/")}
            >
              Login here
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
