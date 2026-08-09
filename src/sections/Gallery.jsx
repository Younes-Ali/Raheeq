import React from "react";
import Reveal from "../components/animations/Reveal";
import { GALLERY } from "../data/content";

export default function Gallery() {
  return (
    <section
      id="gallery"
      data-section="gallery"
      className="bg-[var(--beige)] py-24 px-6"
    >
      <Reveal className="mb-14 text-center">
        <p className="mx-auto max-w-[720px] text-[clamp(1.6rem,3.6vw,2.6rem)] text-[#234230]">
          A whole forest, working in silence
        </p>
      </Reveal>

      <Reveal
        stagger
        className="mx-auto grid max-w-7xl grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6"
      >
        {GALLERY.map((g) => (
          <div
            key={g.img}
            className="group relative overflow-hidden rounded-[20px]"
          >
            <img
              src={g.img}
              alt={g.caption}
              className="block aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 pt-9 pb-5 text-sm text-[#F5F1E8]">
              {g.caption}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}