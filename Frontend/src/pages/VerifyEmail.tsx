import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      API.get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
        .then(() => {
          setMessage("Email verified. You can now sign in.");
          setTimeout(() => navigate("/login"), 1200);
        })
        .catch(() => setMessage("Invalid or expired verification link."));
    }
  }, [params, navigate]);

  const handleSendOtp = async () => {
    try {
      await API.post("/auth/send-otp", { email });
      setMessage("OTP sent to your email.");
    } catch (e: any) {
      setMessage(e?.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await API.post("/auth/verify-otp", { email, otp });
      setMessage("Email verified. You can now sign in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (e: any) {
      setMessage(e?.response?.data?.message || "Failed to verify OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="space-y-2">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={handleSendOtp} variant="secondary">Send OTP</Button>
          </div>
        </div>
        <div className="space-y-2">
          <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Button onClick={handleVerifyOtp} variant="hero">Verify OTP</Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 