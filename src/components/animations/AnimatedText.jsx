import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function Char({ ch, range, progress }) {
  const opacity = useTransform(progress, range, [0.3, 1]);

  return (
    <motion.span style={{ opacity }}>{ch === " " ? "\u00A0" : ch}</motion.span>
  );
}

export default function AnimatedText({ text }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = text.split(" ");
  const totalChars = text.length;
  let charIndex = 0;

  return (
    <p ref={ref}>
      {words.map((word, wordIndex) => {
        const chars = word.split("");
        const startIndex = charIndex;

        charIndex += chars.length + 1;

        return (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {chars.map((ch, charIndexInWord) => {
              const index = startIndex + charIndexInWord;

              return (
                <Char
                  key={index}
                  ch={ch}
                  range={[index / totalChars, (index + 1) / totalChars]}
                  progress={scrollYProgress}
                />
              );
            })}

            {wordIndex < words.length - 1 && "\u00A0"}
          </span>
        );
      })}
    </p>
  );
}
