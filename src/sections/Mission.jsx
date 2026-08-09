import React from 'react';
import AnimatedText from '../components/animations/AnimatedText.jsx';

export default function Mission() {
  return (
    <section
      id="mission"
      data-section="mission"
      className="min-h-[75vh] flex items-center justify-center bg-beige text-green px-5 py-20 md:py-28"
    >
      <div className="max-w-2xl text-center">
        <div className="text-xs md:text-sm tracking-[0.2em] text-green-soft mb-4">OUR STORY</div>

        <h2 className="font-chewy text-5xl md:text-5xl leading-snug mb-5">
          We don't rush the bees, and the bees don't rush the honey.
        </h2>

        <AnimatedText
          text="Every jar of Raheeq comes from a single forest, one bloom season, harvested by hand and never heated past hive temperature, so every enzyme, every trace of pollen, stays exactly as nature made it."
          className=" leading-8 text-yellow-400 text-3xl bg-black/30 p-4 rounded-2xl"
        />
      </div>
    </section>
  );
}
