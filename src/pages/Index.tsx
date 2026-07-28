import { useEffect, useRef, useState } from "react";
import bg from "@/assets/background-1.jpg";
import heroDesktop from "@/assets/head-banner-desktop.png";
import heroTablet from "@/assets/Head-Banner-Tablet.png";
import heroMobile from "@/assets/head-banner-mobile.png";
import kiss from "@/assets/KISS.png";
import logoCream from "@/assets/logo-cream-color.png";
import bannerText from "@/assets/banner-text.png";
import Story from "@/components/sections/Story";
import LipCards from "@/components/sections/LipCards";
import PhotoBanner from "@/components/sections/PhotoBanner";
import Waitlist from "@/components/sections/Waitlist";
import Footer from "@/components/sections/Footer";
import WaitlistPopup from "@/components/WaitlistPopup";

const Index = () => {
  const [isWaitlistPopupOpen, setIsWaitlistPopupOpen] = useState(false);
  const hasAutoOpenedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const popupShown = window.sessionStorage.getItem("maeum-waitlist-popup-shown") === "true";
    hasAutoOpenedRef.current = popupShown;

    const onScroll = () => {
      if (hasAutoOpenedRef.current) return;
      if (window.scrollY > 50) {
        hasAutoOpenedRef.current = true;
        window.sessionStorage.setItem("maeum-waitlist-popup-shown", "true");
        setIsWaitlistPopupOpen(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openWaitlistPopup = () => setIsWaitlistPopupOpen(true);
  const closeWaitlistPopup = () => setIsWaitlistPopupOpen(false);

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "var(--page-padding)",
      }}
    >
      <h1 className="sr-only">Maeum — Beauty, with feeling. Seoul to Skin.</h1>
      <section className="relative h-[50vh] md:h-screen lg:h-[130vh] p-[24px] md:p-[120px] overflow-visible md:overflow-hidden rounded-3xl" aria-label="Hero spacer">
        <div
          className="absolute inset-0 hidden md:block lg:hidden"
          style={{
            backgroundImage: `url(${heroTablet})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 h-full rounded-[36px] hidden lg:block"
          style={{
            backgroundImage: `url(${heroDesktop})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage: `url(${heroMobile})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 w-full h-full flex flex-col justify-between">
          <div className="w-full flex flex-col items-center px-6">
            <div className="w-full flex flex-col items-center">
              <div className="relative w-full flex flex-col items-center">
                <img src={logoCream} alt="Maeum" className="w-[140.65%] md:w-[53.55%] h-auto mt-[25px] hero-logo-fade-up" />
                <img
                  src={bannerText}
                  alt="Heart Mind Feeling"
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-3 lg:mt-[105px] w-[60%] h-auto hidden lg:block"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center px-6">
            <img src={logoCream} alt="Maeum" className="w-40 md:w-80 lg:w-[26rem] h-auto" />
          </div>
        </div>
      </section>
      <section className="relative isolate z-20" aria-label="Divider">
        <div className="mx-auto max-w-[1040px] flex justify-center my-1 md:my-12">
          <img
            src={kiss}
            alt=""
            aria-hidden="true"
            className="w-[110px] md:w-[22rem] animate-[pulse_2.4s_ease-in-out_infinite]"
          />
        </div>
      </section>
      <Story />
      <LipCards />
      <PhotoBanner />
      <Waitlist onOpenPopup={openWaitlistPopup} />
      <Footer />
      <WaitlistPopup isOpen={isWaitlistPopupOpen} onClose={closeWaitlistPopup} />
    </div>
  );
};

export default Index;
