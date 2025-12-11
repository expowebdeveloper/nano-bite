import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useShowErrorMessage } from "../ShowErrorMessage";
import CommonDropDown from "../Dropdown/Dropdown";
import { LogOut, User } from "lucide-react";
import ScreenLoader from "../ScreenLoader/ScreenLoader";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/user/userSlice";

const NavBar = ({ handleCollapseSidebar }: { handleCollapseSidebar: () => void }) => {
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const location = useLocation()
  const [loader, setLoader] = useState(false);
  const showErrorMessage = useShowErrorMessage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);

  // const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

//   useEffect(() => {
//     fetchAPICall({
//       endPoint: UPDATE_USER_PROFILE,
//       method: METHODS.get,
//       instanceType: INSTANCE.authorize,
//     })
//       .then((res) => {
//         const userData = res?.data?.data || {};
//         dispatch(setUserDetails(userData));
//       })
//       .catch((err) => {
//         if(!err?.response){
//           showErrorMessage("Network Error, Please check your internet");
//         }else{
//           showErrorMessage(err?.response?.data?.message || err?.response?.data?.error);

//         }
//       });
//   }, []);

  const handleToggleDropDown = () => {
    setToggleDropDown(!toggleDropDown);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setToggleDropDown(false);
      event.stopPropagation();
    }
  };

  const handleLogout = () => {
    setLoader(true);
    dispatch(loginUser(null));
    localStorage.clear();
    window.location.href = "/login";
    // setToggleDropDown(false)
    // fetchAPICall({
    //   endPoint: LOG_OUT_URL,
    //   method: METHODS.post,
    //   instanceType: INSTANCE.authorize,
    // })
    //   .then(() => {
    //     localStorage.clear();
    //     // navigate("/login");
    //     window.location.href = "/login";
    //   })
    //   .catch(() => {
    //     localStorage.clear();
    //     // navigate("/login");
    //     window.location.href = "/login";
    //     // showErrorMessage(err?.response?.data?.message);
    //   })
    //   .finally(() => {
    //     setLoader(false);
    //   });
  };

  return (
    <div className="ps-3 flex w-full items-center justify-between  pt-2 mb-0 bg-white min-h-[70px] pr-8">
      <button className="collapse-btn" onClick={handleCollapseSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className="flex gap-4 items-center p-1.5 pr-4">
        <div className="relative font-[sans-serif] w-max flex items-center">
          <div ref={dropdownRef}>
            <span
              onClick={handleToggleDropDown}
              className="flex gap-2 cursor-pointer"
            >
              <div className="flex flex-col">
                <p className="flex items-center">
                 {user?.fullName}
                </p>
                  <p className="text-sm text-gray-500">
                    {user?.role}
                  </p>
              </div>
              {/* {userDetails?.organisation_details?.name ? (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold [#7065F6]">
                    {userDetails?.organisation_details?.name[0]?.toUpperCase() || (
                      <span className="cursor-pointer">{USER_ICON}</span>
                    )}
                  </span>
                </div>
              ) : userDetails?.profile_picture ? (
                <ImgIcon
                  src={userDetails.profile_picture}
                  className="rounded-full ml-auto mr-2 w-[32px] h-[32px] object-contain"
                  alt="logo"
                />
              ) : (
                <span className="cursor-pointer">{USER_ICON}</span>
              )} */}
            </span>
            <CommonDropDown
              toggleDropDown={toggleDropDown}
              position="-right-[2.5rem] top-10"
            >
              <div className="px-3 py-1">
                <ul className="space-y-2">
                  <li
                    className={`p-2.5 rounded-full hover:bg-gray-200 ${
                      location?.pathname === "/setting" ? "bg-gray-200" : ""
                    }`}
                  >
                    <Link
                      to={`/setting`}
                      className="text-sm text-gray-500 hover:text-black flex items-center gap-2 text-[#037563]"
                      onClick={() => setToggleDropDown(false)}
                    >
                      <span className="text-sm text-gray-500 hover:text-black flex items-center justify-center gap-2 min-w-[30px]">
                       <User/>
                      </span>
                      My Profile
                    </Link>
                  </li>
                 
                  <li className="p-2.5 rounded-full hover:bg-gray-200">
                    <span
                      onClick={handleLogout}
                      className="text-sm text-gray-500 hover:text-black flex items-center gap-2 cursor-pointer"
                    >
                      <span className="text-sm text-gray-500 hover:text-black flex items-center justify-center gap-2 min-w-[30px]">
                        <LogOut />
                      </span>
                      Logout
                    </span>
                  </li>
                </ul>
              </div>
            </CommonDropDown>
          </div>
        </div>
      </div>
      {loader && <ScreenLoader />}
    </div>
  );
};

export default NavBar;
