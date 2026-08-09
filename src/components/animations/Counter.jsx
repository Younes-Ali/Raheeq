import React, { useEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";

export default function Counter({
  to,
  suffix = "",
  slideIndex,
}) {
  const numberRef = useRef(null);

  const [started, setStarted] = useState(false);

  useEffect(() => {
    // أول Slide يبدأ العد مباشرة
    if (slideIndex === 0) {
      setStarted(true);
      return;
    }

    const handleSlideChange = (e) => {
      const { index, active } = e.detail;

      if (active && index === slideIndex && !started) {
        setStarted(true);
      }
    };

    window.addEventListener("slide-change", handleSlideChange);

    return () => {
      window.removeEventListener("slide-change", handleSlideChange);
    };
  }, [slideIndex, started]);

  useEffect(() => {
    if (!started) return;

    const controls = animate(0, to, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],

      onUpdate(value) {
        if (numberRef.current) {
          numberRef.current.textContent = `${Math.round(value)}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [started, to, suffix]);
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
        y: 25,
      }}
      animate={
        started
          ? {
            opacity: 1,
            scale: 1,
            y: 0,
          }
          : {}
      }
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex justify-center"
    >
      <span
        className="
          display
          select-none
          leading-none
          tracking-tight
          font-bold
          text-[clamp(3.5rem,8vw,7rem)]
          text-[var(--dark-green)]
        "
      >
        <span ref={numberRef}>0{suffix}</span>
      </span>
    </motion.div>
  );
}