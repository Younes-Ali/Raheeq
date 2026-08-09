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
        relative overflow-hidden
        min-h-screen
        p-6 sm:p-8 md:p-12 lg:p-16
        bg-[var(--beige)]
      "
    >
      {/* Heading */}
      <div
        className="
          md:absolute md:left-1/2 md:top-1/2 z-20
          w-[90%] max-w-[520px]
          text-center
          -translate-y-7 md:-translate-x-1/2 md:-translate-y-1/2
        "
      >
        <Reveal>
          <h2
            className="
              text-[clamp(1.7rem,4vw,2.8rem)] text-[var(--dark-green)]
              display
            "
          >
            What people say
          </h2>
        </Reveal>
      </div>

      {/* Testimonials */}
      <Reveal
        stagger
        className="
          relative
          h-full min-h-[85vh]
        "
      >
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            style={POSITIONS[i]}
            className="
              flex flex-col md:absolute
              w-full md:w-[min(300px,30vw)]
              p-5
              bg-white/60
              rounded-2xl border border-[rgba(22,40,28,0.12)]
              shadow-lg backdrop-blur-md
              gap-2
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
            <p
              className="
                text-[18px] text-[rgba(22,40,28,0.8)] leading-7
              "
            >
              &ldquo;{t.quote}&rdquo;
            </p>

            <div
              className="
                mt-3
                text-xs text-[var(--dark-green-soft)]
              "
            >
              {t.name}
            </div>
          </motion.div>
        ))}
      </Reveal>
    </section>
  );
}
