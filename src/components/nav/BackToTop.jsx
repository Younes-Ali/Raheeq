import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    onClick={scrollToTop}
                    initial={{ opacity: 0, scale: 0.7, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{
                        duration: 0.25,
                        ease: "easeOut",
                    }}
                    aria-label="Back to top"
                    className="
            fixed
            bottom-6
            right-6
            z-[1000]
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            border
            border-[rgba(242,234,217,0.25)]
            bg-[var(--dark-green)]
            text-xl
            text-[var(--beige)]
            shadow-lg
            backdrop-blur-sm
            cursor-pointer
          "
                >
                    ↑
                </motion.button>
            )}
        </AnimatePresence>
    );
}
