import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import butterfly1 from "@/assets/butterfly-1.png";
import kiss from "@/assets/KISS.png";
import logoRed from "@/assets/logo-red-color.png";
import storyBg from "@/assets/background-2.png";

gsap.registerPlugin(ScrollTrigger);

const Story = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".story-fade", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative pt-10 pb-14 md:py-24"
      style={{
        backgroundImage: `url(${storyBg})`,
        backgroundSize: "100% auto",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundColor: "transparent",
      }}
      aria-label="Our story"
    >
      <div className="relative max-w-[840px] mx-auto text-center px-4 pt-6 md:pt-0 md:mt-[60px]">
        {/* Side kiss decorations */}
        <img
          src={kiss}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 sm:-left-16 md:-left-28 lg:-left-40 top-6 sm:top-8 md:top-10 w-28 sm:w-32 md:w-36 lg:w-[21rem] opacity-20 -rotate-12 hidden sm:block"
        />
        <img
          src={kiss}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 sm:-right-16 md:-right-28 lg:-right-40 top-[80%] sm:top-[78%] md:top-[74%] w-28 sm:w-32 md:w-36 lg:w-[21rem] opacity-20 rotate-12 hidden sm:block"
        />

        <h2 className="story-fade font-shakehand text-primary text-[48px] md:text-[72px] leading-tight mb-2">
          A lip mask with
        </h2>
        <h3 className="story-fade font-shakehand text-primary text-3xl md:text-[72px] leading-tight mb-10">
          a kiss of <span className="font-myungjo">마음</span> <span className="font-shakehand">Maeum</span>
        </h3>

        <div className="relative space-y-5 text-primary font-geist font-extralight text-[16px] leading-6 md:text-[20px] md:leading-7 lg:text-[32px] lg:leading-[1.3]">
          <img
            src={butterfly1}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute hidden md:block md:-left-24 lg:-left-[120px] -top-[52px] md:-top-6 w-[56px] md:w-16 lg:w-24 h-auto animate-float"
            style={{ animationDuration: "5s" }}
          />

          <p className="story-fade">
            Some things deserve time. Your lips already know the difference between a fix and a
            ritual. So do we.
          </p>
          <p className="story-fade">
            Maeum is a devotion, born in Korea. Rooted in real science. Carried by the quiet spirit
            of jeongseong (정성), the patience of doing something properly, again and again, until
            it becomes love.
          </p>
          <p className="story-fade">
            Every touch, slow on purpose. Skincare that stays long after the mask comes off.{" "}
            Real beauty isn&apos;t a moment. It&apos;s a ritual, a promise you keep to yourself,
            night after night.
          </p>
          <p className="story-fade">
            <img
              src={logoRed}
              alt="Maeum"
              className="inline-block align-middle w-24 md:w-40 h-auto mx-1"
            />
            is for those who feel their skincare instead of just using it — Korean science with
            feeling behind it.
          </p>
        </div>

        <p className="story-fade font-shakehand text-primary text-[40px] md:text-[72px] leading-none mt-6 md:mt-10 -mx-4 md:mx-0">
          xoxo
        </p>
        <p className="story-fade font-shakehand text-primary text-[40px] md:text-[72px] leading-none mt-1 mb-2 md:mb-0">
          With Love, Maeum
        </p>
      </div>
    </section>
  );
};

export default Story;
