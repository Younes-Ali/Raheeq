import { useNavigate } from "react-router-dom";

export default function WalletCard({ i, title, tag, body, img }) {
  const navigate = useNavigate();
  return (
    <article
      className="
        relative flex h-[400px] w-[85vw]
        shrink-0 overflow-hidden rounded-2xl
        border border-white/10
        bg-[var(--dark-green-soft)]
        shadow-[0_20px_45px_rgba(0,0,0,0.18)]
        md:h-[420px] md:w-[50vw]
        lg:h-[440px]
      "
    >
      {/* Content */}
      <div
        className="
          relative z-10 flex min-w-0 flex-1
          flex-col justify-center overflow-y-auto
          p-5 sm:p-7 md:w-1/2 md:flex-none md:p-10
          lg:px-14
        "
      >
        <span className="mb-2 text-xs font-semibold tracking-[0.3em] text-white/50 sm:mb-3">
          {String(i + 1).padStart(2, "0")}
        </span>

        <h3 className="display text-[clamp(1.5rem,4vw,2.7rem)] leading-tight text-[var(--beige)]">
          {title}
        </h3>

        <p className="display mt-2 text-[clamp(1rem,2.5vw,1.7rem)] leading-snug text-yellow-400/90">
          {tag}
        </p>

        <p className="mt-3 text-sm leading-6 text-[rgba(242,234,217,0.75)] sm:mt-5 sm:text-[15px] sm:leading-7">
          {body}
        </p>

        <button
          type="button"
          className="
            mt-5 w-fit shrink-0 rounded-full
            border border-white/15 px-5 py-2.5
            text-sm font-medium text-[var(--beige)]
            transition-colors duration-300
            hover:border-black hover:bg-yellow-400/90 hover:text-black
            sm:mt-7
          "
          onClick={() => navigate("/shop")}
        >
          Learn More →
        </button>
      </div>

      {/* Image */}
      <div className="relative h-full w-1/2 shrink-0 overflow-hidden">
        <img
          src={img}
          alt={title}
          loading="lazy"
          className="
            absolute inset-0 block h-full w-full
            object-cover object-center
            transition-transform duration-700
            hover:scale-105
          "
        />

        <div
          className="
            pointer-events-none absolute inset-0
            bg-gradient-to-t from-[rgba(18,48,40,0.25)] to-transparent
            md:bg-gradient-to-l md:from-transparent
            md:to-[rgba(18,48,40,0.18)]
          "
        />
      </div>
    </article>
  );
}
