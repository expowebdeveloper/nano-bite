import React, { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  btnText: string;
  btnClick?: (event: React.MouseEvent<HTMLButtonElement>) => string | void;
  customClass?: string;
}

function ActionButton({ icon, btnText, btnClick, customClass }: Props) {
  return (
    <div>
      <button
        className={customClass}
        title={btnText}
        onClick={(event) => btnClick && btnClick(event)}
      >
        {icon}
      </button>
    </div>
  );
}

export default ActionButton;

