// import NavBar from "../../components/common/navbar/NavBar";
import {  useState } from "react";
import { ChildrenProps } from "../interfaces/interfaces";
import Sidebar from "../components/common/sidebar/Sidebar";
import NavBar from "../components/common/navbar/Navbar";

const AuthorizationLayout = ({ children }: ChildrenProps) => {
  const [activeSidebar, setActiveSidebar] = useState<boolean>(false);
  const handleCollapseSidebar = () => {
    setActiveSidebar(prev => !prev)
  }

  return (
    <div>
      <div className="bg-white flex border-r border-grey-500 h-screen w-full fixed mt-0 left-0 min-w-[25px] font-[sans-serif]">
        <div>
          <Sidebar activeSidebar={activeSidebar} />
        </div>
        <div className={`${activeSidebar ? `collapse-active` : ` w-[calc(100%-200px)]`} main-content min-h-24 `}>
          <NavBar handleCollapseSidebar={handleCollapseSidebar} />
          <div className="h-[calc(100%-70px)] overflow-y-auto pb-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationLayout;
