import React from "react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  const baseButton = `
    flex
    h-9
    w-9
    items-center
    justify-center
    rounded-full
    border
    border-[rgba(242,234,217,0.25)]
    bg-transparent
    text-sm
    text-[var(--dark-green)]
    transition-all
    duration-300
    ease-out
  `;

  return (
    <div
      className="
        mt-12
        flex
        items-center
        justify-center
        gap-2
      "
    >
      {/* Previous */}
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`
          text-2xl
          font-extrabold
          ${baseButton}
          ${page === 1
            ? "cursor-default opacity-35"
            : "cursor-pointer hover:scale-110 border-black hover:bg-yellow-300"
          }
        `}
      >
        ←
      </button>

      {/* Pages */}
      {pages.map((p) => {
        const active = p === page;

        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`
              font-extrabold
              ${baseButton}
              font-[Chewy]
              ${active
                ? `
                    border-2
                    border-[var(--dark-green)]
                    bg-[var(--dark-green)]
                    text-[var(--beige)]
                  `
                : `
                    cursor-pointer
                    hover:scale-110
                    hover:border-[var(--dark-green)]
                    hover:bg-yellow-300
                  `
              }
            `}
          >
            {p}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={`
          text-2xl
          font-extrabold
          ${baseButton}
          ${page === totalPages
            ? "cursor-default opacity-35"
            : "cursor-pointer hover:scale-110 border-black hover:bg-yellow-300"
          }
        `}
      >
        →
      </button>
    </div>
  );
}
