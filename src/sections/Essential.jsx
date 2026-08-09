import React, { useRef } from 'react';
import { useScroll } from 'framer-motion';
import WalletCard from '../components/animations/WalletCard.jsx';
import { ESSENTIALS } from '../data/content.js';

export default function Essential() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="essential"
      data-section="essential"
      ref={containerRef}
      className="relative bg-[var(--beige)]"
      style={{ height: `${ESSENTIALS.length * 100}vh` }}
    >
      {/* one shared sticky stage — the cards animate inside it */}
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-5">
        <div className="mb-9 text-center">
          <div className="mb-3 text-[13px] tracking-[0.2em] text-[var(--dark-green-soft)]">
            THE ESSENTIAL
          </div>

          <h2 className="display m-0 text-[clamp(1.7rem,3.6vw,2.6rem)] text-[var(--dark-green)]">
            What makes it raw
          </h2>
        </div>

        <div className="relative h-[360px] w-[80%] py-96">
          {ESSENTIALS.map((card, i) => (
            <WalletCard
              key={card.title}
              i={i}
              title={card.title}
              tag={card.tag}
              body={card.body}
              img={card.img}
              range={[i / ESSENTIALS.length, (i + 1) / ESSENTIALS.length]}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}