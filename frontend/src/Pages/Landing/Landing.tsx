import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import section1Bg from "../../assets/images/section1.png";
import section2Bg from "../../assets/images/section2.png";
import icon1 from "../../assets/images/icon1.png";
import icon2 from "../../assets/images/icon2.png";
import icon3 from "../../assets/images/icon3.webp";

/**
 * Landing Page component for Nano Bite.
 * Follows the design provided in the reference image.
 */
const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans text-[#002b5c] selection:bg-blue-100">
            {/* Header / Navbar */}
            <header className="flex items-center justify-between px-6 md:px-12 py-4 bg-white sticky top-0 z-50 shadow-sm border-b border-gray-50">
                <div className="flex items-center">
                    <img
                        src={logo}
                        alt="NANO BITE"
                        className="h-12 md:h-16 w-auto cursor-pointer"
                        onClick={() => navigate("/")}
                    />
                </div>

                <nav className="hidden md:flex items-center gap-12 text-[#1a1a1a]">
                    <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
                    <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-[#4a80e6] text-white px-6 py-2.5 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                        // className="bg-[#4a80e6] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition active:scale-95"
                    >
                        Login
                    </button>
                </nav>

                {/* Mobile login only */}
                <button
                    onClick={() => navigate("/login")}
                    className="md:hidden bg-[#4a80e6] text-white px-5 py-2 rounded-lg font-bold"
                >
                    Login
                </button>
            </header>

            {/* Section 1: Hero Section */}
            <section className="relative w-full overflow-hidden flex flex-col items-center">
                {/* The background image for section 1 */}
                <img
                    src={section1Bg}
                    alt="Dental Design Visualization"
                    //   className="w-full h-auto min-h-[500px] object-cover" 
                    className="w-full h-auto min-h-[560px] md:min-h-[500px] object-cover object-[center_top]"

                />

                {/* CONTENT OVER IMAGE - ABSOLUTE POSITIONING AS REQUESTED */}
                {/* <div className="absolute inset-0 flex flex-col items-center justify-end md:justify-center pb-12 md:pb-0 px-4"> */}
                <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-7 xl:pb-[50px]">
                    <div className="bg-white/10 backdrop-blur-[2px] md:p-6 rounded-3xl text-center">
                        <h1 className="text-[30px] md:text-[50px] xl:text-[80px] font-serif text-[#002b5c] mb-3 xl:mb-6 tracking-tight">
                            We design. You print.
                        </h1>
                        <p className="max-w-2xl text-base md:text-[20px] xl:text-[33px] text-[#3d5a80] mb-4 xl:mb-10 leading-[1.3]">
                            Upload your scan. Get lab-quality denture
                            designs in 24-48 hours.
                        </p>

                        <div className="flex flex-row justify-center gap-4 md:gap-6 mb-8">
                            <button
                                onClick={() => navigate("/signup")}
                                className="text-white px-5 py-2.5 bg-gradient-to-b from-[#4c81df] to-[#3060d6] rounded-lg text-base xl:text-[20px] hover:shadow-md transition-all active:scale-95"
                                // className="bg-[#4a80e6] text-white px-12 py-4 rounded-lg text-xl md:text-2xl font-bold border-2 border-transparent hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-200 active:scale-95"
                            >
                                Start a Case
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-transparent border border-[#ccc] text-[#999] px-5 py-2.5 rounded-lg text-base xl:text-[20px] transition-all hover:bg-[rgba(255,255,255,.7)] hover:shadow-md transitions-all duration-300 active:scale-95"
                                // className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-500 px-12 py-4 rounded-lg text-xl md:text-2xl font-medium hover:bg-white hover:border-gray-300 transition-all active:scale-95"
                            >
                                Login
                            </button>
                        </div>

                        <p className="opacity-90 text-base md:text-[20px] xl:text-[33px] text-[#3d5a80] mb-4 xl:mb-10 leading-[1.3]">
                            Fast. Accurate. Designed for dental professionals.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 2: Cards Section */}
            <section className="w-full py-12 md:py-[60px] bg-white">
                {/* Background image for section 2 */}
                {/* <img
                    src={section2Bg}
                    alt="Background ripples"
                    className="w-full h-auto object-cover"
                /> */}

                {/* CONTENT OVER IMAGE - ABSOLUTE POSITIONING AS REQUESTED */}
                <div className="flex flex-col items-center">
                    <h2 className="text-3xl xl:text-5xl font-serif text-[#002b5c] mb-12 text-center px-4">
                        Who is Nano Bite for?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 md:px-12 max-w-[1400px] w-full">
                        {/* Card 1: Dentists */}
                        {/* <div className="bg-white/40 backdrop-blur-md p-10 md:p-14 rounded-2xl border border-blue-50 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"> */}
                        <div
                            className="p-4 xl:p-10 rounded-2xl border border-blue-50 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 bg-cover bg-center"
                            style={{ backgroundImage: `url(${section2Bg})` }}
                        >
                            <div className="mb-3 xl:mb-6 transform transition-transform duration-300">
                                <img src={icon3} alt="Dentist Icon" className="w-12 xl:w-24 drop-shadow-sm" />
                            </div>
                            <h3 className="text-xl xl:text-[40px] font-serif text-[#002b5c] mb-2 xl:mb-6">Dentists</h3>
                            <p className="text-base xl:text-[22px] text-[#3d5a80] leading-relaxed font-medium">
                                Upload scans → <br />
                                receive precise designfiles
                            </p>
                        </div>

                        {/* Card 2: Designers */}
                        {/* <div className="bg-white/40 backdrop-blur-md p-10 md:p-14 rounded-2xl border border-blue-50 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"> */}
                        <div
                            className="p-4 xl:p-10 rounded-2xl border border-blue-50 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 bg-cover bg-center"
                            style={{ backgroundImage: `url(${section2Bg})` }}
                        >
                            <div className="mb-3 xl:mb-6 transform transition-transform duration-300">
                                <img src={icon1} alt="Designer Icon" className="w-12 xl:w-24 drop-shadow-sm" />
                            </div>
                            <h3 className="text-xl xl:text-[40px] font-serif text-[#002b5c] mb-2 xl:mb-6">Designers</h3>
                            <p className="text-base xl:text-[22px] text-[#3d5a80] leading-relaxed font-medium">
                                Join our network → <br />
                                get paid per case
                            </p>
                        </div>

                        {/* Card 3: Labs / Admins */}
                        {/* <div className="bg-white/40 backdrop-blur-md p-10 md:p-14 rounded-2xl border border-blue-50 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"> */}
                        <div
                            className="p-4 xl:p-10 rounded-2xl border border-blue-50 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 bg-cover bg-center"
                            style={{ backgroundImage: `url(${section2Bg})` }}
                        >
                            <div className="mb-3 xl:mb-6 transform transition-transform duration-300">
                                <img src={icon2} alt="Labs Icon" className="w-12 xl:w-24 drop-shadow-sm" />
                            </div>
                            <h3 className="text-xl xl:text-[40px] font-serif text-[#002b5c] mb-2 xl:mb-6">Labs / Admins</h3>
                            <p className="text-base xl:text-[22px] text-[#3d5a80] leading-relaxed font-medium">
                                Track cases, manage <br />
                                workflows, scale production
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Last Section: Final CTA */}
            {/* <section
                className="py-28 text-center px-4"
                style={{ background: "linear-gradient(135deg, #e7e8fc 0%, #ebe8f9 100%)" }}
            >
                <h2 className="text-3xl md:text-5xl font-serif text-[#002b5c] mb-12">
                    Ready to start your first case?
                </h2>
                <button
                    onClick={() => navigate("/cases")}
                    className="bg-[#4a80e6] text-white px-14 py-5 rounded-2xl text-2xl md:text-3xl font-bold hover:bg-blue-700 transition-all shadow-2xl hover:shadow-blue-300 active:scale-95"
                >
                    Upload Case Now
                </button>
            </section> */}
            <section
                className="py-[50px] px-1 md:px-2"
                style={{ background: "linear-gradient(135deg, #e7e8fc 0%, #ebe8f9 100%)" }}
            >
                <div className="max-w-[1400px] mx-auto px-12">
                    <div className="bg-white rounded-3xl shadow-[0px_0px_20px_rgba(139,139,139, .1)] py-12 px-4 md:px-6 text-center">
                        <h2 className="text-2xl xl:text-4xl font-serif text-[#002b5c] mb-7">
                            Ready to start your first case?
                        </h2>

                        <button
                            onClick={() => navigate("/cases")}
                        className="text-white px-5 py-2.5 bg-gradient-to-b from-[#4c81df] to-[#3060d6] rounded-lg text-base md:text-[20px] hover:shadow-md transition-all active:scale-95"
                            // className="bg-[#4a80e6] text-white px-14 py-5 rounded-2xl text-xl md:text-2xl font-bold hover:bg-blue-700 transition-all shadow-2xl hover:shadow-blue-300 active:scale-95"
                        >
                            Upload Case Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Basic Footer */}
            <footer className="py-12 bg-white border-t border-gray-100 text-center">
                <div className="flex flex-col items-center gap-4">
                    <img src={logo} alt="NANO BITE" className="h-10 w-auto opacity-50 grayscale hover:grayscale-0 transition cursor-pointer" onClick={() => navigate("/")} />
                    <p className="text-sm text-gray-400">© {new Date().getFullYear()} Nano Bite. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
