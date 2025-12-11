import { Routes, Route, Navigate } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router";
import { ToastContainer } from "react-toastify";
import { LoginPage } from "./Pages/Login/Login";
import SignUpFlow from "./Pages/SignUp/SignUpFlow";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import { ResetPassword } from "./Pages/ResetPassword/ResetPassword";
import { SetPassword } from "./Pages/ResetPassword/SetPassword";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Cases from "./Pages/Cases/Cases";
import Messages from "./Pages/Messages/Messages";
import Calendar from "./Pages/Calendar/Calendar";
import Settings from "./Pages/Settings/Settings";
import VerifyEmail from "./Pages/VerifyEmail/VerifyEmail";
import QualityControl from "./Pages/QualityControl/QualityControl";
import Users from "./Pages/Users/Users";
import Payments from "./Pages/Payments/Payments";

function App() {
  return (
    <NuqsAdapter>
      <ToastContainer
        position="top-center"
        toastClassName="!min-w-[400px] !whitespace-pre-wrap !break-words"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        {/* Public Routes - Redirect to dashboard if already authenticated */}
        <Route element={<PublicRoute />}>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpFlow />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

        </Route>

        {/* Private Routes - Redirect to login if not authenticated */}
        <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quality-control" element={<QualityControl />} />
          <Route path="/users" element={<Users />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/setting" element={<Settings />} />
        </Route>

        {/* Default route - Redirect to dashboard if authenticated, else to login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </NuqsAdapter>
  );
}

export default App;
