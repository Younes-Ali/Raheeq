import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef } from "react";

export default function MorphingLogo({ children }) {
  const controls = useAnimationControls();
  const hasMoved = useRef(false);

  useEffect(() => {
    let timeout;

    const start = async () => {
      // يظهر فى النص
      await controls.start({
        opacity: 1,
        scale: 3,
        transition: {
          duration: 0.8,
          ease: "backOut",
        },
      });

      // ينتظر شوية
      timeout = setTimeout(async () => {
        // يطلع أعلى الـ Center
        await controls.start({
          top: 20,
          y: 0,
          scale: 1.2,
          transition: {
            duration: 1,
            ease: [0.76, 0, 0.24, 1],
          },
        });
      }, 600);
    };

    start();

    const handleScroll = () => {
      if (hasMoved.current) return;

      if (window.scrollY > 5) {
        hasMoved.current = true;

        controls.start({
          left: 50,
          x: -30,
          transition: {
            duration: 0.9,
            ease: [0.76, 0, 0.24, 1],
          },
        });

        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [controls]);

  return (
    <motion.h1
      initial={{
        opacity: 0,
        scale: 0.8,
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
      }}
      animate={controls}
      className="
        fixed
        z-50
        display
        inline-block
        rounded-full
        bg-black
        p-1
        text-[clamp(3rem,9vw,6.5rem)]
        select-none
      "
    >
      {children}
    </motion.h1>
  );
}