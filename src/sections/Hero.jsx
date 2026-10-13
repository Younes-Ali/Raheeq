import React from "react";
import { motion } from "framer-motion";
import VideoBackground from "../components/ui/VideoBackground.jsx";
import MorphingLogo from "../components/nav/MorphingLogo.jsx";
import logo from "../../public/images/logo.jpeg";

export default function Hero() {
  return (
    <section id="hero" data-section="hero" className="relative">
      <VideoBackground
        src="/videos/hero.mp4"
        label="فيديو الهيرو (خلفية اللاندنج)"
        expectedPath="public/videos/hero.mp4"
        className="max-md:object-[80%_center]"
      />

      {/* Overlay */}
      <div
        className="
          absolute inset-0
          flex flex-col items-center justify-center
          px-5
          text-center
        "
        style={{
          background:
            "linear-gradient(180deg, rgba(22,40,28,0.35), rgba(22,40,28,0.8))",
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="mb-4 text-[13px] tracking-[0.2em] text-[var(--white)]"
        >
          RAW · HONEST · WILD
        </motion.span>

        <MorphingLogo>
          <img
            src={logo}
            alt="Raheeq Logo"
            className="h-[clamp(3rem,9vw,6.5rem)] w-auto rounded-full"
          />
        </MorphingLogo>

        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 2.5, // استنى لما أنيميشن اللوجو يخلص
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mt-4
            max-w-[480px]
            text-[clamp(3rem,6vw,3.2rem)]
            text-[rgba(242,234,217,0.9)]
          "
        >
          Raw honey, harvested honestly.
        </motion.p>
      </div>
    </section>
  );
}
