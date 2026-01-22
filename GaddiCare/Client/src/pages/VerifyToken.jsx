import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { ArrowLeft, Mail, RefreshCw, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosClient from "@/services/axiosMain";
import { CREATE_NEW_USER, RESEND_VERIFICATION_CODE, VERIFY_RESET_TOKEN } from "@/routes/serverEndpoints";
import { toast } from "sonner";

const VerifyToken = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();
  const [token, setToken] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    const stateEmail = location.state?.email;
    if (!stateEmail) {
      navigate("/login");
      return;
    }
    setEmail(stateEmail);
  }, [location, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newToken = [...token];
    newToken[index] = value;
    setToken(newToken);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newToken.every((digit) => digit !== "")) {
      handleSubmit(newToken.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !token[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const submittedToken = token.join("");
    if (submittedToken.length !== 4) return;

    setIsLoading(true);

    try {
      if (type === "verifyEmail") {
        const response = await axiosClient.post(CREATE_NEW_USER, { email, token: submittedToken });
        if (response.status === 201) {
          toast.success(response?.data?.message || "Account verified and created successfully.");
          navigate("/login");
        }
      } else if (type === "resetPass") {
        const response = await axiosClient.post(VERIFY_RESET_TOKEN, { email, token: submittedToken });
        if (response.status === 200) {
          toast.success(response?.data?.message || "Token verified successfully.");
          navigate("/reset-password", { state: { email } });
        }
      }
    } catch(error) {
      console.log(error||"Error verifying token");
      toast.error(error?.response?.data?.message || "Error verifying token. Please try again.");
    } finally {
      setToken(["", "", "", ""]);
      inputRefs.current[0]?.focus();
      setIsLoading(false);
    }
  };

 const handleResendToken = async () => {
  if (countdown > 0) return;
  setIsResending(true);
  try {
    if (type === "verifyEmail") {
      const response = await axiosClient.post(`${RESEND_VERIFICATION_CODE}/${email}`, { type: "verify" });
      if (response.status === 200) {
        toast.success(response?.data?.message || "Verification code resent successfully.");
      }
    } else if (type === "resetPass") {
      const response = await axiosClient.post(`${RESEND_VERIFICATION_CODE}/${email}`, { type: "reset" });
      if (response.status === 200) {
        toast.success(response?.data?.message || "Reset code resent successfully.");
      }
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error resending verification code. Please try again.");
    console.error("Error resending verification code:", error);
  } finally {
    setCountdown(30);
    setToken(["", "", "", ""]);
    inputRefs.current[0]?.focus();
    setIsResending(false);
  }
};

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              type === "verifyEmail" ? "bg-blue-100" : "bg-orange-100"
            }`}>
              {type === "verifyEmail" ? (
                <Mail className="h-8 w-8 text-blue-600" />
              ) : (
                <Key className="h-8 w-8 text-orange-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {type === "verifyEmail" ? "Verify Your Account" : "Reset Your Password"}
            </h1>
            <p className="text-gray-600">
              Enter the 4-digit code sent to
              <span className="font-semibold text-gray-900"> {email}</span>
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={token[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-center text-2xl font-bold border-2 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              ))}
            </div>

            <Button
              onClick={handleSubmit}
              className={`w-full py-3 ${
                type === "verifyEmail" 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
              disabled={isLoading || token.join("").length !== 4}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                type === "verifyEmail" ? "Verify Account" : "Verify Token"
              )}
            </Button>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={handleResendToken}
                disabled={isResending || countdown > 0}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
                {isResending
                  ? "Sending..."
                  : countdown > 0
                  ? `Resend code in ${countdown}s`
                  : "Resend verification code"}
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              {type === "verifyEmail" 
                ? "Having trouble? Check your spam folder or contact support"
                : "Didn't receive the code? Check your spam folder"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyToken;