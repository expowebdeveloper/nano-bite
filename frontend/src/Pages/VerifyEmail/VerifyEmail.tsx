import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import ScreenLoader from "../../components/common/ScreenLoader/ScreenLoader";
import { CheckCircle, XCircle } from "lucide-react";

type VerifyStatus = "idle" | "loading" | "success" | "error";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail } = useUser();

  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [message, setMessage] = useState<string>("Verifying your email...");

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link. Missing token or email.");
      return;
    }
  
    if (triggeredRef.current) return;
    triggeredRef.current = true;

    const run = async () => {
      try {
        setStatus("loading");
        const data = await verifyEmail.mutateAsync({ token, email });
        setMessage(
          data?.message ||
            data?.data?.message ||
            "Email verified successfully!"
        );
        setStatus("success");
      } catch (error: any) {
        console.log("error", error);
        setMessage(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Email verification failed"
        );
        setStatus("error");
      }
    };

    run();
  }, [token, email]);
  
  console.log("status", status);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  // Show loader only during explicit loading
  const isLoading = status === "loading";

  return (
    <div className="min-h-screen bg-[#fbfeff] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#eaf4fb] max-w-lg w-full p-8 text-center relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-cyan-100 rounded-full blur-3xl opacity-60" />

        <div className="flex items-center justify-center mb-4">
          {status === "success" && (
            <CheckCircle className="w-12 h-12 text-green-500" />
          )}
          {status === "error" && (
            <XCircle className="w-12 h-12 text-red-500" />
          )}
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {status === "success"
            ? "Email Verified"
            : status === "error"
            ? "Verification Failed"
            : "Verifying..."}
        </h1>

        <p className="text-gray-600 mb-6 whitespace-pre-line">{message}</p>

        <div className="flex flex-col gap-3 items-center">
          <button
            onClick={handleGoToLogin}
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5] text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-colors"
          >
            Go to Login
          </button>
          <Link
            to="/signup"
            className="text-sm text-[#0B75C9] font-semibold hover:underline"
          >
            Create a new account
          </Link>
        </div>

        {isLoading && <ScreenLoader isLoading zClass="z-40" />}
      </div>
    </div>
  );
};

export default VerifyEmail;

