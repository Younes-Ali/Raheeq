import { CONTACT_INFO } from "../data/content.jsx";
import { motion } from "framer-motion";

export default function ContactInfo() {
  return (
    <div
      id="contact"
      data-section="contact"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-10 bg-[var(--beige)]"
    >
      {CONTACT_INFO.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 1.2,
              delay: index * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            key={item.id}
            className="group rounded-2xl border border-[var(--dark-green)]/10
            bg-white/70 p-6 shadow-sm transition-all duration-300
            hover:-translate-y-2 hover:shadow-xl"
          >
            <div
              className="mb-5 flex h-14 w-14 items-center justify-center
              rounded-xl bg-[var(--beige)] text-[var(--dark-green)]
              transition-colors duration-300 group-hover:bg-[var(--dark-green)]
              group-hover:text-[var(--beige)]"
            >
              <Icon size={26} />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-[var(--dark-green)]">
              {item.title}
            </h3>

            <p className="mb-4 text-sm leading-6 text-gray-500">
              {item.description}
            </p>

            <p className="mb-5 font-medium text-[var(--dark-green)]">
              {item.value}
            </p>

            {item.link && (
              <a
                href={item.link}
                target={item.link.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold
                text-[var(--dark-green-soft)] transition-colors
                hover:text-[var(--honey)]"
              >
                {item.action} →
              </a>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
