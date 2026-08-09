import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * A single character: an invisible placeholder (keeps its natural layout
 * space so nothing jumps) plus an absolutely-positioned twin whose opacity
 * is the one that actually animates, driven by its own slice of the
 * paragraph's scroll progress.
 */
function Char({ ch, range, progress }) {
  const opacity = useTransform(progress, range, [0.5, 1]);
  const display = ch === ' ' ? '\u00A0' : ch;
  return (
    <span className="relative inline-block">
      <span className="opacity-0">{display}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">
        {display}
      </motion.span>
    </span>
  );
}

/**
 * Splits `text` into characters and reveals them one after another as the
 * paragraph scrolls through the viewport — each letter's opacity goes from
 * 0.2 to 1 within its own slice of the paragraph's own scroll progress
 * (tracked from when the paragraph's top hits 80% of the viewport, to when
 * its bottom hits 20%), giving a "being written / lighting up" feel that's
 * driven entirely by scroll position, not time.
 */
export default function AnimatedText({ text, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');
  const total = chars.length;

  return (
    <p ref={ref} className={className}>
      {chars.map((ch, i) => (
        <Char key={i} ch={ch} range={[i / total, (i + 1) / total]} progress={scrollYProgress} />
      ))}
    </p>
  );
}
