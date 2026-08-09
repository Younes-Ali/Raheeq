import React from "react";
import { CATEGORIES } from "../../data/dummyProducts.js";

export default function FilterBar({ active, onChange }) {
  return (
    <div
      className="
        mb-10
        flex
        flex-wrap
        justify-center
        gap-2.5
      "
    >
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;

        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`
              cursor-pointer
              rounded-full
              border
              px-5
              py-2.5
              text-[13px]
              tracking-[0.04em]
              transition-all
              duration-300
              ease-out
              hover:-translate-y-0.5
              ${isActive
                ? `
                    border-[var(--dark-green)]
                    bg-[var(--dark-green)]
                    text-[var(--beige)]
                  `
                : `
                    border-[var(--dark-green)]
                    bg-transparent
                    text-[var(--dark-green)]
                    hover:border-[var(--dark-green)]
                    hover:bg-yellow-300
                  `
              }
            `}
            style={{
              fontFamily: "'Chewy', system-ui, sans-serif",
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
