import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logoRed from "@/assets/logo-red-color.png";

const Home = () => {
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const tabletVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const playVisible = () => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const isTablet = window.matchMedia("(min-width: 768px)").matches;

      const entries: { el: HTMLVideoElement | null; active: boolean }[] = [
        { el: desktopVideoRef.current, active: isDesktop },
        { el: tabletVideoRef.current, active: !isDesktop && isTablet },
        { el: mobileVideoRef.current, active: !isDesktop && !isTablet },
      ];

      for (const { el, active } of entries) {
        if (!el) continue;
        if (active) {
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      }
    };

    playVisible();

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const tabletQuery = window.matchMedia("(min-width: 768px)");
    desktopQuery.addEventListener("change", playVisible);
    tabletQuery.addEventListener("change", playVisible);

    return () => {
      desktopQuery.removeEventListener("change", playVisible);
      tabletQuery.removeEventListener("change", playVisible);
    };
  }, []);

  return (
    <div className="relative h-[100dvh] min-h-screen w-full overflow-hidden bg-black">
      <h1 className="sr-only">Maeum — Beauty, with feeling.</h1>

      <video
        ref={mobileVideoRef}
        className="absolute inset-0 h-full w-full object-cover md:hidden"
        src="/mobile2.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <video
        ref={tabletVideoRef}
        className="absolute inset-0 hidden h-full w-full object-cover md:block lg:hidden"
        src="/tablet2.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <video
        ref={desktopVideoRef}
        className="absolute inset-0 hidden h-full w-full object-cover lg:block"
        src="/desktop2.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full w-full flex-col items-center px-6">
        <div className="flex flex-1 items-center justify-center pt-[8vh]">
          <img
            src={logoRed}
            alt="Maeum"
            className="w-[88%] max-w-[22rem] h-auto sm:max-w-[28rem] md:w-[70%] md:max-w-[44rem] lg:w-[62%] lg:max-w-[56rem]"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>

        <div className="flex flex-col items-center gap-5 pb-12 md:gap-7 md:pb-16 lg:pb-20">
          <p className="font-myungjo uppercase text-white text-[32px] leading-none tracking-[0.06em] md:text-[56px] lg:text-[58px]">
            Coming soon!
          </p>
          <Link
            to="/explainer"
            className="font-myungjo uppercase tracking-[0.12em] text-white text-[14px] md:text-[20px] lg:text-[22px] leading-none bg-transparent border-0 p-0 pb-1 border-b border-white transition-opacity duration-300 hover:opacity-70"
            aria-label="Go to explainer page"
          >
            Join the waitlist
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
