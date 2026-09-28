import Link from "next/link";
import { Caveat, Playfair_Display, Anton } from "next/font/google";
import collage from "@/app/assests/Cream Aesthetic Minimalist Vision Board Desktop Wallpaper (1).png"

const handwriting = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const display = Anton({
  subsets: ["latin"],
  weight: ["400"],
});

const manifesto = [
  { numeral: "I", text: "To create jewelry pieces that are visually appealing and bright" },
  {
    numeral: "II",
    text: "We believe getting lost in little details like handwritten notes and personalised packaging",
  },
  { numeral: "III", text: "Handcrafted which dictates that perfection is imperfect" },
  {
    numeral: "IV",
    text: "To create pieces that are probably inspired by everything that's nature and clean contemporary architectural lines",
  },
  { numeral: "V", text: "Classics reimagined for modern women" },
];

function Envelope({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 230"
      className={className}
      role="img"
      aria-label="Hand-drawn envelope tied with twine and sealed with a red wax stamp"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* soft ground shadow */}
      <path d="M46 216 L288 184 L288 190 L48 222 Z" fill="#000" opacity="0.06" />

      {/* envelope body */}
      <path
        d="M12 48 L263 12 L285 180 L43 212 Z"
        fill="#EFECE6"
        stroke="#161616"
        strokeWidth="2.2"
      />

      {/* flap */}
      <path
        d="M12 48 L140 132 L263 12"
        fill="none"
        stroke="#161616"
        strokeWidth="2"
      />

      {/* faint inner fold lines */}
      <path d="M43 212 L120 150" stroke="#161616" strokeWidth="1" opacity="0.35" fill="none" />
      <path d="M285 180 L176 148" stroke="#161616" strokeWidth="1" opacity="0.35" fill="none" />

      {/* twine – two strands with a twisted texture */}
      <g fill="none">
        <path d="M125 24 C130 80 140 140 158 200" stroke="#A8724C" strokeWidth="6" />
        <path d="M125 24 C130 80 140 140 158 200" stroke="#4E3221" strokeWidth="6" strokeDasharray="1.2 4.2" />
        <path d="M137 22 C142 80 152 138 170 198" stroke="#B57E56" strokeWidth="6" />
        <path d="M137 22 C142 80 152 138 170 198" stroke="#4E3221" strokeWidth="6" strokeDasharray="1.2 4.2" />
        <path d="M122 24 C127 80 137 140 155 200" stroke="#161616" strokeWidth="0.8" opacity="0.6" />
        <path d="M173 197 C155 138 145 80 140 22" stroke="#161616" strokeWidth="0.8" opacity="0.6" />
      </g>

      {/* wax seal */}
      <g>
        <circle cx="153" cy="138" r="23" fill="#8E1219" opacity="0.35" transform="translate(2 3)" />
        <circle cx="152" cy="135" r="22" fill="#D6202B" stroke="#7E0F16" strokeWidth="2" />
        <circle cx="152" cy="135" r="15" fill="none" stroke="#A8151E" strokeWidth="1.5" />
        <path
          d="M139 128 C143 120 152 117 160 120"
          fill="none"
          stroke="#F06A70"
          strokeWidth="2.5"
          opacity="0.8"
        />
      </g>
    </svg>
  );
}

function Sparkle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M-5 0H5M0 -5V5M-3.5 -3.5L3.5 3.5M-3.5 3.5L3.5 -3.5"
      strokeWidth="1.3"
    />
  );
}

function Flute() {
  return (
    <g>
      {/* rim */}
      <ellipse cx="0" cy="0" rx="20" ry="5" />
      {/* bowl */}
      <path d="M-20 0 C-22 30 -15 54 -3 63" />
      <path d="M20 0 C22 30 15 54 3 63" />
      {/* stem */}
      <path d="M-3 63 L-2.4 134" />
      <path d="M3 63 L2.4 134" />
      {/* base */}
      <ellipse cx="0" cy="139" rx="25" ry="6.5" />
      {/* liquid line */}
      <path d="M-18.5 20 Q-9 14 0 20 T18.5 19" />
      <path d="M-17 24 Q-9 20 0 24 T17 23" opacity="0.6" />
      {/* bubbles */}
      <circle cx="-8" cy="34" r="1.3" />
      <circle cx="-3" cy="42" r="1" />
      <circle cx="6" cy="31" r="1.2" />
      <circle cx="9" cy="40" r="1" />
      <circle cx="0" cy="29" r="0.9" />
    </g>
  );
}

function Champagne({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 200"
      className={className}
      role="img"
      aria-label="Line illustration of two champagne glasses clinking"
      fill="none"
      stroke="#111"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="translate(88 30) rotate(14)">
        <Flute />
      </g>
      <g transform="translate(128 36) rotate(-18)">
        <Flute />
      </g>
      <Sparkle x={82} y={16} s={1} />
      <Sparkle x={148} y={50} s={1.2} />
      <Sparkle x={134} y={98} s={0.9} />
    </svg>
  );
}

export default function OurStory() {
  return (
    <main className="relative min-h-screen w-full bg-[#FAF6F0] text-black">
      {/* Replaced the bulky button with an elegant, editorial-style back link */}
      <Link
        href="/"
        aria-label="Back to home"
        className={`${serif.className} absolute left-6 top-8 z-50 text-[11px] uppercase tracking-[0.2em] text-[#555] transition-colors duration-300 hover:text-[#C1121F] md:left-12 md:top-12`}
      >
        &#8592; Back to Home
      </Link>

      {/* Section 1: Our Story split layout */}
      <section className="grid grid-cols-1 md:min-h-[90vh] md:grid-cols-2">
        <div className="flex flex-col items-center justify-center px-6 pb-12 pt-28 md:py-0">
          <h1
            className={`${handwriting.className} text-center text-7xl font-semibold leading-none text-black sm:text-8xl lg:text-9xl`}
          >
            Our Story
          </h1>
          <Envelope className="mt-8 h-auto w-64 sm:w-72 lg:w-80" />
        </div>

        {/* UPDATED IMAGE CONTAINER */}
        <div className="relative flex h-[50vh] w-full items-center justify-center p-4 md:h-full md:p-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collage.src}
            alt="Torn-edge moodboard collage with sketches, swatches and Ridhira packaging"
            className="max-h-full max-w-full object-contain drop-shadow-md"
          />
        </div>
      </section>

      {/* Section 2: Our Manifesto */}
      <section className="grid grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-12 md:px-12 lg:px-20 lg:py-24">
        <h2
          className={`${display.className} text-center text-5xl italic tracking-wider text-[#555] sm:text-6xl md:text-right lg:text-7xl`}
        >
          Our Manifesto
        </h2>

        <ol className="w-full max-w-xl md:justify-self-start">
          {manifesto.map((item) => (
            <li
              key={item.numeral}
              className="flex items-center gap-6 border-b-[3px] border-gray-700 py-6 first:pt-0 sm:gap-8 md:py-7"
            >
              <span
                className={`${serif.className} w-16 shrink-0 text-center text-5xl leading-none text-[#555] sm:w-20 sm:text-6xl md:text-7xl`}
              >
                {item.numeral}
              </span>
              <p className={`${serif.className} text-base leading-snug text-gray-900 sm:text-lg`}>
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Section 3: Signature / Outro */}
      <section className="flex flex-col items-center px-6 py-20 text-center md:py-32">
        <h2
          className={`${handwriting.className} max-w-3xl text-6xl font-semibold leading-[1.15] text-[#C1121F] sm:text-7xl lg:text-8xl`}
        >
          Celebrate all that is &lsquo;YOU&rsquo;
        </h2>

        <Champagne className="mt-10 h-auto w-44 sm:w-52" />

        <p
          className={`${handwriting.className} mt-8 whitespace-pre-line text-5xl font-semibold leading-tight text-[#C1121F] sm:text-6xl`}
        >
          {"love,\nRidhira"}
        </p>
      </section>
    </main>
  );
}