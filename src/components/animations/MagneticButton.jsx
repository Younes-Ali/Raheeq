import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticButton({
  children,
  className = "",
  onClick,
}) {
  const ref = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, {
    stiffness: 180,
    damping: 15,
  });

  const y = useSpring(mouseY, {
    stiffness: 180,
    damping: 15,
  });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();

    const moveX = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const moveY = (e.clientY - rect.top - rect.height / 2) * 0.35;

    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.04 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        bg-yellow-400
        px-8
        py-4
        text-sm
        font-medium
        text-black
        transition-colors
        hover:bg-yellow-200
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}