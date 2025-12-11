import React from 'react';
import dashboard from '../../assets/images/dashboard2.png';
const TreatmentCard = () => {
    return (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 relative h-full flex justify-between">
            <div className="relative z-10 max-w-[50%]">
                <h2 className="text-2xl font-medium text-gray-900 leading-tight mb-2">
                    Which <span className="text-blue-500 font-bold">treatment</span> suits you <span className="text-blue-500 font-bold">best?</span>
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                    Find the ideal dental solution tailored to your smile.
                </p>
            </div>

            {/* Abstract Tooth Illustration Placeholder */}
            {/* <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48"> */}
                {/* This is a CSS-only representation of the tooth splash graphic */}
                <div className="relative z-10 flex items-center gap-6 h-full">

                <div className="relative  -left-4">
                <div className="w-48 h-48">
                  <img src={dashboard} alt="Dr. Smith" className="absolute -top-[4.9rem] left-1/2 -translate-x-1/2 z-20" />
                </div>
              </div>
            </div>
        </div>
    );
};

export default TreatmentCard;
