import React from "react";
import { NAV_SECTIONS } from "../../data/content.js";

export default function BottomNav({ activeSection }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 h-[130px] bg-black/60 pointer-events-none pt-60"
      />

      <nav
        className="
          relative
          flex
          items-center
          justify-between
          p-[36px]
          text-[13px]
          uppercase
          tracking-[0.08em]
          pointer-events-auto
        "
        style={{
          paddingInline: "clamp(16px,4vw,48px)",
        }}
      >
        {/* Line */}
        <div
          className="absolute top-1/2 h-px bg-[var(--dark-green)] opacity-25 z-0"
          style={{
            left: "clamp(16px,4vw,48px)",
            right: "clamp(16px,4vw,48px)",
          }}
        />

        {NAV_SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`
              relative
              z-100
              whitespace-nowrap
              [-webkit-text-stroke:0.25px_#ffffff]
              origin-bottom
              transition-all
              duration-300
              ease-out
              ${activeSection === s.id
                ? "font-bold text-white scale-[1.5] md:scale-[2.5]"
                : "font-normal text-gray-400 scale-[1]"
              }
            `}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}