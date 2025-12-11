import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Banknote, CheckCircle, Clock4, FileText, Palette, Pen, Receipt, ShieldCheck, Users } from "lucide-react";
import RecentCasesTable from "./RecentCasesTable";
import CaseDueDates from "./CaseDueDates";
import TreatmentCard from "./TreatmentCard";
import dashboard from "../../assets/images/dashboard.png";

/**
 * Dashboard component - Main page for authenticated users
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.user);

  type CardConfig = {
    label: string;
    value: string | number;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
  };
  
  const role = (user?.role || "").toLowerCase();

  const cardsByRole: Record<string, CardConfig[]> = {
    designer: [
      { label: "Assigned", value: 8, Icon: FileText },
      { label: "In Design", value: 12, Icon: Pen },
      { label: "Delivered", value: 30, Icon: CheckCircle },
    ],
    admin: [
      { label: "Total Case", value: 320, Icon: FileText },
      { label: "Total Pending", value: 42, Icon: Clock4 },
      { label: "Total Delivered", value: 210, Icon: CheckCircle },
      { label: "Total Doctors", value: 87, Icon: Users },
      { label: "Total Designer", value: 34, Icon: Palette },
      { label: "Total Payments", value: "$12.3k", Icon: Receipt  },
    ],
    qc: [
      { label: "Assigned", value: 14, Icon: FileText },
      { label: "In Review", value: 6, Icon: ShieldCheck },
      { label: "Approved", value: 120, Icon: CheckCircle },
    ],
    dentist: [
      { label: "Submitted", value: 3, Icon: FileText },
      { label: "In Design", value: 5, Icon: Pen },
      { label: "Completed", value: 50, Icon: CheckCircle },
    ],
  };

  const cards = cardsByRole[role] || cardsByRole.dentist;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#fbfeff] p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column: Welcome + Stats + Recent Cases */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Welcome Banner */}
          <div className="relative bg-[#2B89D2] rounded-2xl p-8 h-40">
            <div className="relative z-10 flex items-center gap-6 h-full">
              <div className="relative -top-5 -left-4">
                <div className="w-48 h-48">
                  <img src={dashboard} alt="Dr. Smith" className="absolute top-0 left-1/2 -translate-x-1/2 z-20" />
                </div>
              </div>

              <div className="text-white pt-4">
                <p className="text-sm font-medium mb-1 opacity-90">Hi, {user?.fullName}</p>
                <h2 className="text-3xl font-bold mb-2">Welcome, {user?.role === "Dentist" ?  "Dr." : ""} {user?.fullName}</h2>
                <p className="text-blue-100 text-sm">Track and manage your dental cases efficiently</p>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 overflow-hidden"></div>
            <div className="absolute bottom-0 right-20 w-32 h-32 bg-blue-400/30 rounded-full blur-2xl overflow-hidden"></div>
            <div className="absolute top-10 right-10">
              <div className="w-16 h-16 border-4 border-white/10 rounded-xl transform rotate-12"></div>
            </div>
            <div className="absolute bottom-10 right-40">
              <div className="w-10 h-10 bg-white/10 rounded-lg transform -rotate-12"></div>
            </div>
            {/* Close button */}
            <div className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
  {cards.map((card) => (
    <div
      key={card.label}
      className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-5 border border-gray-50"
    >
      <div
        className="rounded-full p-4 shadow-blue-100 shadow-lg bg-[#2B89D2]"
      >
        <card.Icon className="text-white" size={24} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{card.label}</p>
        <p className="text-3xl font-bold text-gray-900">0</p>
      </div>
    </div>
  ))}
</div>

          {/* Recent Cases Table */}
          <div>
            <RecentCasesTable />
          </div>

        </div>

        {/* Right Column: Calendar + Treatment Card */}
        <div className="flex flex-col gap-6">
          <div className="min-h-[100px]">
            <CaseDueDates />
          </div>
          <div >
            <TreatmentCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

