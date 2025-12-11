import React from "react";
import logo from "../../assets/images/logo.png";

interface SignUpHeaderProps {
  title?: string;
  subtitle?: string;
}

const SignUpHeader: React.FC<SignUpHeaderProps> = ({
  title = "Create Your NanoBite Account",
  subtitle = "Join the next-gen platform for dental case management",
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-start mb-4">
        <img src={logo} className="w-40 h-40 object-contain" />
      </div>

      <h3 className="text-3xl font-semibold mb-2 text-left text-transparent bg-clip-text bg-gradient-to-r from-[#0B75C9] to-[#3BA6E5]">
        {title}
      </h3>
      <p className="text-[#6C6C6C] text-sm text-left">
        {subtitle}
      </p>
    </div>
  );
};

export default SignUpHeader;

