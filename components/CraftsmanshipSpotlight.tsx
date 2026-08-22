// "use client";

// import Image from "next/image";
// import { useState, useCallback } from "react";
// import { motion } from "framer-motion";

// /**
//  * WooCommerce product shape.
//  * Swap `mockProducts` for a real fetch (REST `wp-json/wc/store/v1/products`
//  * or the WooCommerce GraphQL `products` query) and map the response onto
//  * this interface — the slider and card markup don't need to change.
//  */
// interface WooCommerceProduct {
//   id: number;
//   name: string;
//   price: number; // store as a plain number (paise-free rupees), format at render time
//   imageSrc: string;
//   imageAlt?: string;
//   slug?: string;
// }

// const mockProducts: WooCommerceProduct[] = [
//   {
//     id: 1,
//     name: "Product 1",
//     price: 0,
//     imageSrc: "/products/product-1.png",
//     imageAlt: "Backpack product photo",
//     slug: "product-1",
//   },
//   {
//     id: 2,
//     name: "Product 2",
//     price: 0,
//     imageSrc: "/products/product-2.png",
//     imageAlt: "Backpack product photo",
//     slug: "product-2",
//   },
//   {
//     id: 3,
//     name: "Product 3",
//     price: 0,
//     imageSrc: "/products/product-3.png",
//     imageAlt: "Backpack product photo",
//     slug: "product-3",
//   },
//   {
//     id: 4,
//     name: "Product 4",
//     price: 0,
//     imageSrc: "/products/product-4.png",
//     imageAlt: "Backpack product photo",
//     slug: "product-4",
//   },
//   {
//     id: 5,
//     name: "Product 5",
//     price: 0,
//     imageSrc: "/products/product-5.png",
//     imageAlt: "Backpack product photo",
//     slug: "product-5",
//   },
// ];

// const formatINR = (value: number) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     minimumFractionDigits: 2,
//   }).format(value);

// /** Position of a slide relative to the active index, wrapped for looping. */
// function getOffset(index: number, active: number, length: number) {
//   let offset = index - active;
//   if (offset > length / 2) offset -= length;
//   if (offset < -length / 2) offset += length;
//   return offset;
// }

// export default function OurCollection() {
//   const [active, setActive] = useState(0);
//   const length = mockProducts.length;

//   const goTo = useCallback(
//     (index: number) => setActive(((index % length) + length) % length),
//     [length]
//   );

//   const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);
//   const goNext = useCallback(() => goTo(active + 1), [active, goTo]);

//   return (
//     <section className="bg-white py-20 lg:py-28">
//       <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-8 lg:px-12">
//         {/* Left: title + subtitle */}
//         <div className="text-center lg:text-left">
//           <h2 className="font-sans text-4xl font-extrabold tracking-tight text-neutral-900 lg:text-6xl">
//             Our Collection
//           </h2>
//           <p className="mt-4 text-base text-neutral-500 lg:text-lg">
//             Explore our latest products.
//           </p>
//         </div>

//         {/* Right: 3D coverflow slider */}
//         <div className="flex flex-col items-center">
//           <div className="relative h-[340px] w-full max-w-[520px] lg:h-[420px]">
//             {mockProducts.map((product, index) => {
//               const offset = getOffset(index, active, length);
//               const isActive = offset === 0;
//               // Only render the active slide and its immediate neighbours.
//               if (Math.abs(offset) > 2) return null;

//               return (
//                 <motion.div
//                   key={product.id}
//                   className="absolute inset-0 mx-auto flex w-[260px] flex-col items-center lg:w-[320px]"
//                   style={{ zIndex: 10 - Math.abs(offset) }}
//                   initial={false}
//                   animate={{
//                     x: `${offset * 60}%`,
//                     scale: isActive ? 1 : 0.8,
//                     opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.5,
//                   }}
//                   transition={{ type: "spring", stiffness: 260, damping: 30 }}
//                 >
//                   <button
//                     type="button"
//                     aria-label={`Show ${product.name}`}
//                     onClick={() => goTo(index)}
//                     className={`relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 transition-shadow ${
//                       isActive
//                         ? "shadow-2xl shadow-neutral-400/40"
//                         : "shadow-none"
//                     }`}
//                   >
//                     <Image
//                       src={product.imageSrc}
//                       alt={product.imageAlt ?? product.name}
//                       fill
//                       sizes="(max-width: 1024px) 60vw, 320px"
//                       className="object-contain p-8"
//                     />
//                   </button>

//                   {isActive && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 6 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.1 }}
//                       className="mt-4 text-center"
//                     >
//                       <p className="text-sm font-semibold text-neutral-900">
//                         {product.name}
//                       </p>
//                       <p className="mt-1 text-sm text-neutral-500">
//                         {formatINR(product.price)}
//                       </p>
//                     </motion.div>
//                   )}
//                 </motion.div>
//               );
//             })}
//           </div>

//           {/* Arrows */}
//           <div className="mt-6 flex items-center gap-3">
//             <button
//               type="button"
//               aria-label="Previous product"
//               onClick={goPrev}
//               className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white transition hover:bg-neutral-700"
//             >
//               <ChevronLeft />
//             </button>
//             <button
//               type="button"
//               aria-label="Next product"
//               onClick={goNext}
//               className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white transition hover:bg-neutral-700"
//             >
//               <ChevronRight />
//             </button>
//           </div>

//           {/* Pagination dots */}
//           <div className="mt-4 flex items-center gap-2">
//             {mockProducts.map((product, index) => (
//               <button
//                 key={product.id}
//                 type="button"
//                 aria-label={`Go to ${product.name}`}
//                 onClick={() => goTo(index)}
//                 className={`h-1.5 rounded-full transition-all ${
//                   index === active
//                     ? "w-5 bg-neutral-900"
//                     : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function ChevronLeft() {
//   return (
//     <svg
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M15 18l-6-6 6-6" />
//     </svg>
//   );
// }

// function ChevronRight() {
//   return (
//     <svg
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M9 18l6-6-6-6" />
//     </svg>
//   );
// }





"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * WooCommerce product shape.
 * Swap `mockProducts` for a real fetch (REST `wp-json/wc/store/v1/products`
 * or the WooCommerce GraphQL `products` query) and map the response onto
 * this interface — the slider and card markup don't need to change.
 */
interface WooCommerceProduct {
  id: number;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt?: string;
  slug?: string;
}

const mockProducts: WooCommerceProduct[] = [
  {
    id: 1,
    name: "Product 1",
    price: 0,
    imageSrc: "/products/product-1.png",
    imageAlt: "Backpack product photo",
    slug: "product-1",
  },
  {
    id: 2,
    name: "Product 2",
    price: 0,
    imageSrc: "/products/product-2.png",
    imageAlt: "Backpack product photo",
    slug: "product-2",
  },
  {
    id: 3,
    name: "Product 3",
    price: 0,
    imageSrc: "/products/product-3.png",
    imageAlt: "Backpack product photo",
    slug: "product-3",
  },
  {
    id: 4,
    name: "Product 4",
    price: 0,
    imageSrc: "/products/product-4.png",
    imageAlt: "Backpack product photo",
    slug: "product-4",
  },
  {
    id: 5,
    name: "Product 5",
    price: 0,
    imageSrc: "/products/product-5.png",
    imageAlt: "Backpack product photo",
    slug: "product-5",
  },
];

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);

/** Position of a slide relative to the active index, wrapped for looping. */
function getOffset(index: number, active: number, length: number) {
  let offset = index - active;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

export default function OurCollection() {
  const [active, setActive] = useState(0);
  const length = mockProducts.length;

  const goTo = useCallback(
    (index: number) => setActive(((index % length) + length) % length),
    [length]
  );

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);
  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);

  // Calculates the 3D position and rotation for the Coverflow effect
  const getCardStyles = (offset: number) => {
    if (offset === 0) {
      return { x: "0%", rotateY: 0, scale: 1, zIndex: 30, opacity: 1 };
    } else if (offset === -1) {
      return { x: "-65%", rotateY: 65, scale: 0.85, zIndex: 20, opacity: 1 };
    } else if (offset === 1) {
      return { x: "65%", rotateY: -65, scale: 0.85, zIndex: 20, opacity: 1 };
    } else {
      return {
        x: offset < 0 ? "-120%" : "120%",
        rotateY: offset < 0 ? 80 : -80,
        scale: 0.7,
        zIndex: 0,
        opacity: 0,
      };
    }
  };

  return (
    <section className="bg-white py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-8 lg:px-12">
        
        {/* Left: title + subtitle */}
        <div className="text-center lg:text-left">
          <h2 className="font-sans text-4xl font-extrabold tracking-tight text-neutral-900 lg:text-6xl">
            Our Collection
          </h2>
          <p className="mt-4 text-base text-neutral-500 lg:text-lg">
            Explore our latest products.
          </p>
        </div>

        {/* Right: 3D coverflow slider */}
        <div className="flex flex-col items-center">
          {/* Critical: The container must have perspective applied for 3D rotation to work */}
          <div 
            className="relative flex h-[340px] w-full max-w-[520px] items-center justify-center lg:h-[420px]"
            style={{ perspective: "1200px" }}
          >
            {mockProducts.map((product, index) => {
              const offset = getOffset(index, active, length);
              const isActive = offset === 0;
              const styles = getCardStyles(offset);

              // Don't render items too far out to save DOM nodes
              if (Math.abs(offset) > 2) return null;

              return (
                <motion.div
                  key={product.id}
                  className="absolute flex w-[260px] flex-col items-center lg:w-[320px] cursor-pointer"
                  initial={false}
                  animate={{
                    x: styles.x,
                    rotateY: styles.rotateY,
                    scale: styles.scale,
                    zIndex: styles.zIndex,
                    opacity: styles.opacity,
                  }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  onClick={() => {
                    if (offset === -1) goPrev();
                    if (offset === 1) goNext();
                  }}
                >
                  <div
                    className={`relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 transition-shadow ${
                      isActive
                        ? "shadow-2xl shadow-neutral-400/40"
                        : "shadow-none"
                    }`}
                  >
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt ?? product.name}
                      fill
                      sizes="(max-width: 1024px) 60vw, 320px"
                      className="object-contain p-8"
                    />
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mt-4 text-center"
                    >
                      <p className="text-sm font-semibold text-neutral-900">
                        {product.name}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        {formatINR(product.price)}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Arrows */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous product"
              onClick={goPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white shadow-md transition hover:bg-neutral-700 hover:shadow-lg"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Next product"
              onClick={goNext}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white shadow-md transition hover:bg-neutral-700 hover:shadow-lg"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Pagination dots */}
          <div className="mt-4 flex items-center gap-2">
            {mockProducts.map((product, index) => (
              <button
                key={product.id}
                type="button"
                aria-label={`Go to ${product.name}`}
                onClick={() => goTo(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === active
                    ? "w-5 bg-neutral-900"
                    : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}