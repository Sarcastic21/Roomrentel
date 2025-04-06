import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
     const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;    
      const response = await fetch(`${apiBaseUrl}/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        alert("OTP sent to your email.");
        setStep(2);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
     const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;    
      const response = await fetch(`${apiBaseUrl}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Password updated successfully.");
        window.location.href = "/login";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-[#2D3A45]">
      <Navbar />
      <div className="flex justify-center items-center px-6 py-20">
        <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {step === 1 ? "Forgot Password" : "Reset Your Password"}
          </h2>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
              />
              <button
                type="submit"
                className="w-full bg-[#FF6B6B] text-white py-2 rounded-lg font-semibold hover:bg-[#fa5252] transition"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
              />
              <button
                type="submit"
                className="w-full bg-[#FF6B6B] text-white py-2 rounded-lg font-semibold hover:bg-[#fa5252] transition"
              >
                Reset Password
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-[#FF6B6B] hover:underline text-sm"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
