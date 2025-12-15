import { Link, NavLink } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import ImgIcon from "../icons/ImgIcon";
import { SIDE_BAR_ITEMS } from "../../../Constants/Constants";
import {
  ArrowRight,
} from "lucide-react";

import { useSelector } from "react-redux";

const Sidebar = ({ activeSidebar }: { activeSidebar: boolean }) => {
  const { user } = useSelector((state: any) => state.user);

  console.log(">>>", user)
  const filteredItems = SIDE_BAR_ITEMS.filter((item) =>
    item.allowedRoles.includes(user?.role)
  );

  return (
    <nav
      className={`${activeSidebar ? `collapse-sidebar` : ``
        } dash-sidebar bg-[#EEFCFF] flex border-r border-grey-500 h-screen mt-0 left-0 min-w-[345px] font-[sans-serif]`}
    >
      <div className="relative flex flex-col h-full border-r border-grey-500 w-full">
        <Link
          to="/"
          className="text-center bg-[#EEFCFF] py-[14px] flex justify-center min-h-[70px]"
        >
          <ImgIcon
            src={activeSidebar ? logo : logo}
            alt="logo"
            className={activeSidebar ? `w-[40px]` : `w-[120px]`}
          />
        </Link>
        <ul
          className={`dash-sidelinks flex-1 ${window.innerHeight < 800 ? "mt-1" : "mt-4"
            } sidebar-list`}
        >
          {filteredItems.map((item, i) => (
            <li key={i} className="!m-0">
              {activeSidebar ? (
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    `text-[17px] flex items-center justify-center text-black px-4 py-4 
                     transition-all gap-5 border-transparent ${isActive
                      ? "!text-[#fff] active-link shadow-md bg-[#2B89D2] "
                      : "hover:bg-[#E6FBFF] hover:text-[#000]"
                    } ${item.name === "contact_directory" ||
                      item.name === "agreements" ||
                      item.name === "documents_directory" ||
                      item.name === "document_access_requests"
                      ? "fill-icon"
                      : "stroke-icon"
                    }`
                  }
                >
                  {item.icon()}
                </NavLink>
              ) : (
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    `text-[17px] font-semibold flex items-center relative "text-black px-4 ${window.innerHeight < 800 ? "py-3" : "py-4"
                    } 
                    transition-all gap-5 border-transparent ${isActive
                      ? "!text-[#fff] active-link shadow-md bg-[#2B89D2] rounded-r-full mr-5"
                      : "hover:bg-[#E6FBFF] hover:text-[#000]"
                    } ${item.name === "contact_directory" ||
                      item.name === "agreements" ||
                      item.name === "documents_directory" ||
                      item.name === "document_access_requests"
                      ? "fill-icon"
                      : "stroke-icon"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.icon()}
                      <span
                        className={`${activeSidebar
                          ? "invisible opacity-0"
                          : "opacity-1 visible"
                          } transition-colors duration-400 ease-in-out`}
                      >
                        {(user?.role === "QC" && item.name === "Cases") ? "Assigned Cases"  : item.name}
                      </span>
                      {isActive && (
                        <span className="border border-gray-400 rounded-full p-2 bg-white absolute right-4 top-1/2 -translate-y-1/2">
                          <ArrowRight className="w-5 h-5 text-[#2B89D2]" />
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
