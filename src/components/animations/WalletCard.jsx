import React from "react";
import { motion, useTransform } from "framer-motion";

const PEEK = 34;

export default function WalletCard({
  i,
  title,
  tag,
  body,
  img,
  range,
  progress,
}) {
  const y = useTransform(progress, range, [420, i * PEEK]);
  const opacity = useTransform(
    progress,
    [range[0], range[0] + (range[1] - range[0]) * 0.4],
    [0, 1]
  );

  return (
    <motion.div
      style={{ y, opacity, zIndex: i }}
      className="
        absolute inset-x-0 top-0
        flex h-[500px] flex-col md:flex-row
        flex-shrink-0
        overflow-hidden rounded-[32px]
        border border-white/10
        bg-[var(--dark-green-soft)]
        shadow-[0_20px_45px_rgba(0,0,0,0.28)]
      "
    >
      {/* Text Side */}
      <div className="flex flex-col justify-center p-10 lg:px-14">
        <span className="mb-3 text-sm font-semibold tracking-[0.35em] uppercase text-white/50">
          0{i + 1}
        </span>

        <h3 className="display text-[clamp(2rem,3vw,2.7rem)] leading-tight text-[var(--beige)]">
          {title}
        </h3>
        <p className="display text-[clamp(1rem,2vw,1.7rem)] leading-tight text-yellow-400/90">
          {tag}
        </p>
        <p className="mt-6 max-w-md text-[15px] leading-8 text-[rgba(242,234,217,0.75)]">
          {body}
        </p>

        <button
          className="
            mt-8 w-fit
            rounded-full
            border border-white/15
            px-6 py-3
            text-sm font-medium
            text-[var(--beige)]
            transition-all duration-300
            hover:border-white/30
            hover:bg-white/10
          "
        >
          Learn More →
        </button>
      </div>

      {/* Image Side */}
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={img}
          alt={title}
          className="
            h-full w-full
            object-cover
            transition-transform duration-700
            hover:scale-105
          "
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[rgba(18,48,40,.18)]" />
      </div>
    </motion.div>
  );
}