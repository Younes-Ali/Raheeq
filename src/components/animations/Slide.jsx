import React from "react";
import {
    motion,
    useMotionValueEvent,
    useTransform,
} from "framer-motion";

export default function Slide({
    children,
    progress,
    index,
    total,
}) {
    const start = index / total;
    const end = (index + 1) / total;

    // يتحرك من تحت -> المنتصف -> فوق
    const y = useTransform(
        progress,
        [start, (start + end) / 2, end],
        ["100%", "0%", "-100%"]
    );

    // Fade
    const opacity = useTransform(
        progress,
        [start, start + 0.1, end - 0.1, end],
        [0, 1, 1, 0]
    );

    // Scale
    const scale = useTransform(
        progress,
        [start, (start + end) / 2, end],
        [0.8, 1, 1.3]
    );

    // Blur
    const blur = useTransform(
        progress,
        [start, start + 0.1, end - 0.1, end],
        [10, 0, 0, 10]
    );

    // لمعرفة إذا كان الـ Slide هو الحالي
    const active = useTransform(
        progress,
        (v) => v >= start && v < end
    );

    useMotionValueEvent(active, "change", (value) => {
        window.dispatchEvent(
            new CustomEvent("slide-change", {
                detail: {
                    index,
                    active: value,
                },
            })
        );
    });

    return (
        <motion.div
            style={{
                y,
                opacity,
                scale,
                filter: useTransform(blur, (b) => `blur(${b}px)`),
            }}
            className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                px-5
                sm:px-8
                md:px-12
                lg:px-20
                text-center
                will-change-transform
            "
        >
            {children}
        </motion.div>
    );
}