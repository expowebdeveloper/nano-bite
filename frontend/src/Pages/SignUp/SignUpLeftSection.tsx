import React from "react";
import main from "../../assets/images/main2.png";

const SignUpLeftSection: React.FC = () => {
  return (
    <div
      className="
        md:w-1/2 
        m-6   
        flex flex-col items-center justify-center 
        relative rounded-[29px]
        bg-gradient-to-b
        from-[rgba(59,166,229,0.15)]
        via-[rgba(11,117,201,0.46)]
        to-[rgba(11,117,201,0.46)]
      "
    >
      <div className="text-center mb-8">
        <img src={main} className="mx-auto max-w-[80%] h-auto" />
      </div>

      <div className="absolute bottom-8 text-3xl md:text-6xl lg:text-8xl font-bold text-[#3388CC] opacity-20">
        NANOBITE
      </div>
    </div>
  );
};

export default SignUpLeftSection;

