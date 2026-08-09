import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--dark-green)] px-6 py-12 text-center">
            <div className="flex max-w-xl flex-col items-center">

                {/* 404 */}
                <span
                    className="
            display
            text-[clamp(7rem,25vw,15rem)]
            leading-none
            text-[var(--beige)]
            opacity-90
          "
                >
                    404
                </span>

                {/* Small label */}
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[rgba(242,234,217,0.55)]">
                    Lost in the wild
                </p>

                {/* Heading */}
                <h1
                    className="
            display
            mt-5
            text-[clamp(2rem,5vw,3.5rem)]
            leading-tight
            text-[var(--beige)]
          "
                >
                    This page doesn't exist.
                </h1>

                {/* Description */}
                <p className="mt-4 max-w-md text-sm leading-7 text-[rgba(242,234,217,0.65)] sm:text-base">
                    Looks like you've wandered somewhere outside the hive.
                    Let's get you back to Raheeq.
                </p>

                {/* Back Home */}
                <Link
                    to="/"
                    className="
            mt-8
            inline-flex
            items-center
            justify-center
            rounded-full
            bg-[var(--beige)]
            px-8
            py-4
            text-sm
            font-medium
            text-[var(--dark-green)]
            transition-all
            duration-300
            hover:scale-105
            hover:bg-yellow-200
            active:scale-95
          "
                >
                    ← Back Home
                </Link>

            </div>
        </main>
    );
}
