import { ErrorMessage, Field } from 'formik'
import { span } from 'framer-motion/client'
import React from 'react'

export default function FullField({ label, name, type, placeholder, as, rows, optional, maxLength, inputMode }) {
    return (
        <div>
            <label
                htmlFor={name}
                className="
                block
                mb-2
                text-sm text-[var(--beige)]
              "
            >
                {label}
                {optional &&
                    <span
                        className="
                        ml-2
                        text-xs
                        opacity-40
                      "
                    >
                        Optional
                    </span>
                }
            </label>

            <Field
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                as={as}
                rows={rows}
                maxLength={maxLength}
                inputMode={inputMode}
                className="
                w-full
                px-5 py-4
                text-sm text-black placeholder:text-black/40
                bg-[var(--beige)]
                rounded-2xl
                border border-[rgba(242,234,217,0.15)] focus:border-[var(--beige)]
                outline-none
                transition
              "
            /
            >

            <ErrorMessage
                name={name}
                component="p"
                className="
                mt-2
                text-xs text-red-300
              "
            /
            >
        </div>
    )
}
