import { useNavigate } from "react-router-dom";
import heroImg from "../../assets/images/hero_crop.png";
import cardsImg from "../../assets/images/cards_crop.png";
import ctaImg from "../../assets/images/cta_crop.png";
// import logo from "../../assets/images/logo_crop.png";
import logo2 from "../../assets/images/logo.png"

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">

      {/* Navbar */}
      <header className="w-full px-8 py-4 flex justify-between items-center bg-white">
        <img
          src={logo2}
          alt="logo"
          className="h-20 w-auto cursor-pointer"
          onClick={() => navigate("/")}
        />

        <div className="flex items-center gap-12 mr-16">
          <a href="/landing" className="text-base">Home</a>
          <a href="/landing#how-it-works" >How it Works</a>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-5 py-2 rounded-md"
          >
            Login
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative w-full">
        <img src={heroImg} className="w-full h-auto" />

        {/* CLICK AREAS */}
        <div className="absolute inset-0">

          {/* Start Case */}
          <div
            className="absolute 
              top-[86%] left-[22%] 
              w-[14%] h-[6%] 
              cursor-pointer 
              bg-red-500 opacity-50"
            onClick={() => navigate("/signup")}
          />

          {/* Login */}
          <div
            className="absolute 
              top-[86%] left-[40%] 
              w-[10%] h-[6%] 
              cursor-pointer
              bg-red-500 opacity-50"
            onClick={() => navigate("/login")}
          />
        </div>
      </section>

      {/* CARDS */}
      <section className="relative w-full mt-10">
        <img src={cardsImg} className="w-full h-auto" />

        <div className="absolute inset-0">

          {/* Card 1 */}
          <div
            className="absolute 
              top-[22%] left-[12%] 
              w-[22%] h-[55%] 
              cursor-pointer"
            onClick={() => navigate("/signup")}
          />

          {/* Card 2 */}
          <div
            className="absolute 
              top-[22%] left-[39%] 
              w-[22%] h-[55%] 
              cursor-pointer"
            onClick={() => navigate("/signup")}
          />

          {/* Card 3 */}
          <div
            className="absolute 
              top-[22%] left-[66%] 
              w-[22%] h-[55%] 
              cursor-pointer"
            onClick={() => navigate("/signup")}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full mt-10 mb-16">
        <img src={ctaImg} className="w-full h-auto" />

        <div className="absolute inset-0">
          <div
            className="absolute 
              top-[55%] left-[50%] 
              -translate-x-1/2 
              w-[18%] h-[20%] 
              cursor-pointer"
            onClick={() => navigate("/login")}
          />
        </div>
      </section>

    </div>
  );
};

export default Landing;