"use client";

import { Button } from "@/components/ui/button";
import React from "react";

const ICONS_ROW1 = [
  "https://cdn.21st.dev/assets/mirror/86/8622b1a4306b413670d9d200591dac7a11d02f70dc525683e44ba14b91737a90.png",
  "https://cdn.21st.dev/assets/mirror/8e/8ee5be289b25fe1868edb80dd7ebd3f8de6f9cc581c1324261bc74146a2bd0e8.png",
  "https://cdn.21st.dev/assets/mirror/b6/b6f94ff4cf6d63ecd9945dd0c6fd806c82afad8cb1f4b350cb0ff9297d6fdb74.png",
  "https://cdn.21st.dev/assets/mirror/8e/8ec92b4cf29e37b05768a5b7027ff6da920ebeec32e16b4063f5b70617fc079d.png",
  "https://cdn.21st.dev/assets/mirror/83/8387574f7ebab08465d1419134bbff0e73bc26ca7220b18d16a264d67f996116.png",
  "https://cdn.21st.dev/assets/mirror/61/61243e3e521df8314819e9929dd5d53d53dc3161545b0fc74c27edf96130190d.png",
  "https://cdn.21st.dev/assets/mirror/a1/a1a606bc6e11ae6714100008321081c24019489862df4243fe436a51adff5ab4.png",
];

const ICONS_ROW2 = [
  "https://cdn.21st.dev/assets/mirror/9e/9eb6ffcfa297dc25aebd90fd7930e9d4ad724d8cd496d4621df28ddc29631d77.png",
  "https://cdn.21st.dev/assets/mirror/e8/e899b6d586e1dc1058236c2f16969da36e3a7bdf126a51153ed723e710995823.png",
  "https://cdn.21st.dev/assets/mirror/e6/e6a8797615bf186b1e2bbe586dc3bb2a0b13a8924ba1ead2a431bd3e7d95dd70.png",
  "https://cdn.21st.dev/assets/mirror/fb/fbae1b43d23969d7c2078467a5431adc4b6b39d88d88a3710ed9b08c51a9fd3d.png",
  "https://cdn.21st.dev/assets/mirror/03/03b8741ba2f1e519cafd7c185ece02da69086370a576ec27d0d014a5864ede2e.png",
  "https://cdn.21st.dev/assets/mirror/d2/d2e9f9dda468cbbf30b63ec62ed81dfbea099e09552632d4be89570a8486ec50.png",
  "https://cdn.21st.dev/assets/mirror/a7/a7e2f5f2c86fba897e233c7a04830382b81b31603b4d1f05a46fcd5c7e4d45c8.png",
];

// Utility to repeat icons enough times
const repeatedIcons = (icons: string[], repeat = 4) => Array.from({ length: repeat }).flatMap(() => icons);

export default function IntegrationHero() {
  return (
    <section className="relative py-32 overflow-hidden bg-white dark:bg-black">
      {/* Light grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <span className="inline-block px-3 py-1 mb-4 text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white">
          ⚡ Integrations
        </span>
        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
          Integrate with favorite tools
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-white max-w-xl mx-auto">
          250+ top apps are available to integrate seamlessly with your workflow.
        </p>
        <Button variant="default" className="mt-8 px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition">
          Get started
        </Button>

        {/* Carousel */}
        <div className="mt-12 overflow-hidden relative pb-2">
          {/* Row 1 */}
          <div className="flex gap-10 whitespace-nowrap animate-scroll-left">
            {repeatedIcons(ICONS_ROW1, 4).map((src, i) => (
              <div key={i} className="h-16 w-16 flex-shrink-0 rounded-full bg-white dark:bg-gray-300 shadow-md flex items-center justify-center">
                <img src={src} alt="icon" className="h-10 w-10 object-contain" />
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-10 whitespace-nowrap mt-6 animate-scroll-right">
            {repeatedIcons(ICONS_ROW2, 4).map((src, i) => (
              <div key={i} className="h-16 w-16 flex-shrink-0 rounded-full bg-white dark:bg-gray-300 shadow-md flex items-center justify-center">
                <img src={src} alt="icon" className="h-10 w-10 object-contain" />
              </div>
            ))}
          </div>

          {/* Fade overlays */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
