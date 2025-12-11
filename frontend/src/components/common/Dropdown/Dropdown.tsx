import { ChildrenProps } from "../../../interfaces/interfaces";

interface props extends ChildrenProps {
  toggleDropDown: boolean;
  position?: string;
  width?: string;
}

const CommonDropDown = ({
  children,
  toggleDropDown,
  position = "left-4 top-11",
  width = "w-64",
}: props) => {
  return (
    <div
      className={`absolute block ${position} shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] bg-white py-4 z-[1000] min-w-full rounded-xl ${width} max-h-[500px] overflow-auto mt-2 ${
        toggleDropDown ? "block" : "hidden"
      }`}
    >
      {children}
    </div>
  );
};

export default CommonDropDown;
