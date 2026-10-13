import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import WalletCard from "../components/animations/WalletCard.jsx";
import { ESSENTIALS } from "../data/content.js";

export default function Essential() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    <section
      id="essential"
      data-section="essential"
      ref={containerRef}
      className="relative bg-[var(--beige)]"
      style={{
        height: `${Math.max(ESSENTIALS.length, 2) * 100}vh`,
      }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-8 sm:py-12">
        <div className="mb-8 shrink-0 px-5 text-center sm:mb-10">
          <div className="mb-3 text-[11px] tracking-[0.2em] text-[var(--dark-green-soft)] sm:text-[13px]">
            THE ESSENTIAL
          </div>

          <h2 className="display text-[clamp(1.7rem,3.6vw,2.6rem)] text-[var(--dark-green)]">
            What makes it raw
          </h2>
        </div>

        <div className="w-full overflow-hidden">
          <motion.div
            style={{ x }}
            className="flex w-max gap-4 px-5 sm:gap-6 sm:px-10 md:gap-8 md:px-[8vw]"
          >
            {ESSENTIALS.map((card, i) => (
              <WalletCard
                key={card.title}
                i={i}
                title={card.title}
                tag={card.tag}
                body={card.body}
                img={card.img}
              />
            ))}
          </motion.div>
        </div>

        <div className="mt-7 flex items-center justify-center gap-3 px-5">
          <span className="h-px w-10 bg-[var(--dark-green-soft)]/30" />
          <span className="text-[10px] tracking-[0.2em] text-[var(--dark-green-soft)]">
            SCROLL TO EXPLORE
          </span>
          <span className="h-px w-10 bg-[var(--dark-green-soft)]/30" />
        </div>
      </div>
    </section>
  );
}
