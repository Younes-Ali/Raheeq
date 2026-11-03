import React from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { STATS } from "../data/content";
import "../styles/stats.css";

function StatCard({ stat, index, isInView }) {
  const count = useMotionValue(0);
  const numberRef = useRef(null);
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, Number(stat.value) || 0, {
      duration: 2,
      delay: index * 0.15,
      ease: "easeOut",
    });

    const unsubscribe = count.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [isInView, stat.value, index, count]);

  return (
    <motion.div
      className="stat-honey-card"
      initial={{ opacity: 0, y: 45, scale: 0.9 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 45, scale: 0.9 }
      }
      transition={{
        duration: 0.8,
        delay: index * 0.16,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="stat-card-inner">
        <div className="stat-card-top">
          <span className="stat-index">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="stat-dot" />
        </div>

        <div className="stat-number-wrapper">
          <motion.svg
            className="stat-honey-drop"
            viewBox="0 0 120 140"
            initial={{ opacity: 0, scale: 0.3, y: 15 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.3, y: 15 }
            }
            transition={{
              duration: 1,
              delay: index * 0.15 + 0.25,
              ease: "easeOut",
            }}
          >
            <defs>
              <linearGradient
                id={`honey-gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f7d77a" />
                <stop offset="100%" stopColor="#e9b949" />
              </linearGradient>
            </defs>

            <path
              d="M60 5 C60 5 12 65 12 91 C12 119 33 135 60 135 C87 135 108 119 108 91 C108 65 60 5 60 5Z"
              fill={`url(#honey-gradient-${index})`}
            />
          </motion.svg>

          <div className="stat-number" ref={numberRef}>
            {displayValue.toLocaleString()}
            <span>{stat.suffix}</span>
          </div>
        </div>

        <div className="stat-card-content">
          <p className="stat-pre">{stat.pre}</p>

          <h3 className="stat-label">{stat.label}</h3>

          <p className="stat-post">{stat.post}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Stats() {
  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
  });

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="stats-container">
        <motion.div
          className="stats-heading"
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="stats-eyebrow">
            <span />
            OUR IMPACT
            <span />
          </span>

          <h2>
            Pure nature.
            <br />
            <span>Real impact.</span>
          </h2>

          <p>
            Every drop tells a story of nature, quality, and the people who
            trust us.
          </p>
        </motion.div>

        <div className="stats-honeycomb">
          {STATS.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        <motion.div
          className="stats-footer"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <span />
          <p>ROOTED IN NATURE, MADE WITH CARE</p>
          <span />
        </motion.div>
      </div>
    </section>
  );
}
