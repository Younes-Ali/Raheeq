import React from "react";
import { motion } from "framer-motion";
import VideoBackground from "../components/ui/VideoBackground";
import MagneticButton from "../components/animations/MagneticButton";
import { useNavigate } from "react-router-dom";

export default function Cta() {
  const navigate = useNavigate();
  return (
    <section
      id="contact"
      data-section="contact"
      className="relative"
    >
      <VideoBackground
        src="/videos/cta.mp4"
        label="فيديو الدعوة الختامية (CTA)"
        expectedPath="public/videos/cta.mp4"
        height="70vh"
      />

      {/* Overlay */}
      <div
        className="
          absolute inset-0
          flex flex-col items-center justify-center
          bg-gradient-to-b
          from-[#16281c]/25
          to-[#16281c]/85
          px-5
          text-center
        "
      >
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="display text-[clamp(1.9rem,4.6vw,3.3rem)] text-[var(--beige)]"
        >
          Taste the Bloom
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.9,
            delay: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-7"
        >
          <MagneticButton
            onClick={() => navigate("/shop")}
          >
            Shop the Collection
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}