import React from "react";

export default function Footer() {
  const link = "tel:+201007552567";
  return (
    <footer
      style={{
        background: "var(--beige)",
        padding: "clamp(32px, 5vw, 56px) clamp(20px, 5vw, 60px) 110px",
        textAlign: "center",
        fontSize: 13,
        letterSpacing: "0.04em",
        color: "rgba(22,40,28,0.55)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
      }}
    >
      <h4>
        For bulk orders, wholesale honey, and business inquiries from companies
        and factories, please contact us at the following number.
      </h4>
      <a
        href={link}
        target={link.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
        className="bg-yellow-300 rounded-full p-5 inline-flex items-center gap-2 text-sm font-semibold
                text-[var(--dark-green-soft)] transition-colors
                hover:text-[var(--beige)] hover:bg-[var(--dark-green-soft)]"
      >
        +20 100 755 2567
      </a>
      <p>Raheeq — grown slowly, harvested honestly.</p>
    </footer>
  );
}
