import { ReactNode } from "react";
import ButtonLoader from "../Loader/Loader";
import { BUTTON_TYPE } from "../../../Constants/Constants";

type BtnType = "submit" | "reset" | "button" | undefined;


interface props {
  btnText: string;
  btnType?: BtnType;
  btnClick?: () => string | void | Promise<void>;
  disable?: boolean;
  loader?: boolean;
  class?: string;
  icon?: ReactNode;
  backGround?: boolean;
  btnLoader?: boolean;
  customClass?: string;
  bgTransparent?: boolean;
  rightSideIcon?: ReactNode;
  isSign?: boolean;
  border?: boolean;
}

const Button = ({
  btnClick,
  btnType = BUTTON_TYPE.button,
  btnText,
  disable,
  icon,
  backGround,
  btnLoader,
  customClass = "",
  bgTransparent,
  rightSideIcon,
  isSign = false,
  border= true
}: props) => {
  return (
    <button
      type={btnType}
      onClick={btnClick}
      disabled={disable}
      className={`${customClass} common-btn flex items-center justify-center gap-2 px-4 py-2 font-xs font-normal text-[12px]  ${
        backGround ? "common-btn-background" : border ? "common-btn-border" : ""
      } ${bgTransparent ? "bg-transparent underline" : ""} ${
        disable ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {btnLoader && <ButtonLoader />}
      {!isSign && icon}
      {btnText}
      {isSign && icon}
      {rightSideIcon}
    </button>
  );
};

export default Button;
