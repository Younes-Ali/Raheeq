import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import Slide from "./Slide";

export default function PinSlideSection({
  slides,
  background = "var(--beige)",
}) {
  const containerRef = useRef(null);

  // Progress من أول السيكشن لآخره
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{
        height: `${slides.length * 100}vh`,
        background,
      }}
    >
      {/* Sticky Stage */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <Slide
            key={index}
            index={index}
            total={slides.length}
            progress={scrollYProgress}
          >
            {slide}
          </Slide>
        ))}
      </div>
    </section>
  );
}