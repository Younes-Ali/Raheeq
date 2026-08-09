import React from "react";
import { motion } from "framer-motion";
import Reveal from "../components/animations/Reveal";
import { TESTIMONIALS } from "../data/content";

const POSITIONS = [
  { top: "8%", left: "4%" },
  { top: "2%", left: "38%" },
  { top: "10%", right: "3%" },
  { bottom: "6%", left: "2%" },
  { bottom: "2%", left: "36%" },
  { bottom: "8%", right: "4%" },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      data-section="testimonials"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[var(--beige)]
        px-6
        py-6
        sm:px-8
        md:px-12
        lg:px-16
      "
    >
      {/* Heading */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          z-10
          w-[min(90%,520px)]
          -translate-x-1/2
          -translate-y-1/2
          text-center
          pointer-events-none
        "
      >
        <Reveal>
          <h2 className="display text-[clamp(1.7rem,4vw,2.8rem)] text-[var(--dark-green)]">
            What people say
          </h2>
        </Reveal>
      </div>

      {/* Testimonials */}
      <Reveal stagger className="relative min-h-[85vh] h-full">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            style={POSITIONS[i]}
            className="
              absolute
              w-[min(300px,30vw)]
              rounded-2xl
              border
              border-[rgba(22,40,28,0.12)]
              bg-white/60
              p-5
              backdrop-blur-md
              shadow-lg
            "
            animate={{
              y: -12,
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.25,
            }}
            whileHover={{
              scale: 1.03,
              y: -18,
              transition: {
                duration: 0.25,
              },
            }}
          >
            <p className="text-[18px] leading-7 text-[rgba(22,40,28,0.8)]">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="mt-3 text-xs text-[var(--dark-green-soft)]">
              {t.name}
            </div>
          </motion.div>
        ))}
      </Reveal>
    </section>
  );
}