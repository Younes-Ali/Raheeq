import React from "react";
import PinSlideSection from "../components/animations/PinSlideSection.jsx";
import Counter from "../components/animations/Counter.jsx";
import { STATS } from "../data/content.js";

export default function Stats() {
  const slides = STATS.map((s, index) => (
    <div
      key={s.label}
      className="flex flex-col items-center justify-center text-center"
    >
      {/* Top Text */}
      <p className="mb-3 text-[15px] tracking-[0.05em] text-[rgba(22,40,28,0.65)]">
        {s.pre}
      </p>

      {/* Counter */}
      <Counter
        to={s.value}
        suffix={s.suffix}
        slideIndex={index}
      />

      {/* Title */}
      <h2 className="display mt-2 text-[clamp(1.4rem,3vw,2.2rem)] text-[var(--dark-green)]">
        {s.label}
      </h2>

      {/* Bottom Text */}
      <p className="mt-3 text-sm text-[rgba(22,40,28,0.55)]">
        {s.post}
      </p>
    </div>
  ));

  return (
    <PinSlideSection
      slides={slides}
      background="var(--beige)"
    />
  );
}