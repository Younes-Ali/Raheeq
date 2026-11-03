import React from "react";
import { motion } from "framer-motion";
import Reveal from "../components/animations/Reveal";
import { TESTIMONIALS } from "../data/content.jsx";

const POSITIONS = [
  "md:top-[8%] md:left-[4%]",
  "md:top-[2%] md:left-[38%]",
  "md:top-[10%] md:right-[3%]",
  "md:bottom-[6%] md:left-[2%]",
  "md:bottom-[2%] md:left-[38%]",
  "md:bottom-[8%] md:right-[4%]",
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: "easeOut",
    },
  }),
};

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      data-section="testimonials"
      className="relative overflow-hidden min-h-screen p-5 sm:p-8 md:p-12 lg:p-16 bg-[var(--beige)]"
    >
      {" "}
      <div className="relative z-20 mx-auto mb-10 w-full max-w-[520px] text-center md:absolute md:left-1/2 md:top-1/2 md:mb-0 md:-translate-x-1/2 md:-translate-y-1/2">
        {" "}
        <Reveal>
          {" "}
          <h2 className="text-[clamp(1.7rem,4vw,2.8rem)] text-[var(--dark-green)] display">
            What people say{" "}
          </h2>{" "}
        </Reveal>{" "}
      </div>
      <div className="relative flex flex-col gap-5 md:block md:min-h-[85vh]">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className={`relative z-10 flex w-full flex-col gap-2 rounded-2xl border border-[rgba(22,40,28,0.12)] bg-white/75 p-5 shadow-[0_10px_30px_rgba(22,40,28,0.08)] transition-shadow duration-300 hover:shadow-[0_15px_35px_rgba(22,40,28,0.14)] md:absolute md:w-[min(300px,30vw)] ${POSITIONS[i] || ""}`}
          >
            <p className="text-[18px] leading-7 text-[rgba(22,40,28,0.8)]">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="mt-3 text-xs text-[var(--dark-green-soft)]">
              {t.name}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
