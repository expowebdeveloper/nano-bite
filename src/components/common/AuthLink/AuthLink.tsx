import React from "react";
import { Link } from "react-router-dom";

interface AuthLinkProps {
  text: string;
  path: string;
  linkText: string;
}

const AuthLink: React.FC<AuthLinkProps> = ({ text, path, linkText }) => {
  return (
    <p className="text-center text-[14px] text-gray-600">
      {text}{" "}
      <Link
        to={path}
        className="text-[#0B75C9] font-semibold hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
};

export default AuthLink;

