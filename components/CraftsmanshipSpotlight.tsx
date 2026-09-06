"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * WooCommerce product shape used by the slider.
 */
interface WooCommerceProduct {
  id: number;
  name: string;
  price: string;
  imageSrc: string;
  imageAlt?: string;
  slug?: string;
}

interface WPGraphQLProduct {
  databaseId: number;
  name: string;
  slug: string;
  price: string | null;
  image: {
    sourceUrl: string;
    altText?: string;
  } | null;
}

// Change this to swap which category the slider pulls from.
const PRODUCT_CATEGORY_SLUG = "our-collection";

const WP_GRAPHQL_ENDPOINT = "https://wp.ridhira.in/graphql";

const CATEGORY_PRODUCTS_QUERY = `
  query GetCategoryProducts($category: [String], $first: Int) {
    products(first: $first, where: { categoryIn: $category }) {
      nodes {
        databaseId
        name
        slug
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
        }
        ... on VariableProduct {
          price
        }
      }
    }
  }
`;

/** Position of a slide relative to the active index, wrapped for looping. */
function getOffset(index: number, active: number, length: number) {
  let offset = index - active;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

export default function OurCollection() {
  const router = useRouter();
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  const length = products.length;

  useEffect(() => {
    let isMounted = true;

    async function fetchCategoryProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(WP_GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: CATEGORY_PRODUCTS_QUERY,
            variables: {
              category: [PRODUCT_CATEGORY_SLUG],
              first: 6,
            },
          }),
        });

        if (!res.ok) {
          throw new Error(`GraphQL request failed with status ${res.status}`);
        }

        const json = await res.json();

        if (json.errors) {
          throw new Error(
            json.errors[0]?.message ?? "GraphQL query returned errors"
          );
        }

        const nodes: WPGraphQLProduct[] = json?.data?.products?.nodes ?? [];

        const mapped: WooCommerceProduct[] = nodes.map((product) => ({
          id: product.databaseId,
          name: product.name,
          price: product.price ?? "",
          imageSrc: product.image?.sourceUrl ?? "/placeholder-product.jpg",
          imageAlt: product.image?.altText || product.name,
          slug: product.slug,
        }));

        if (isMounted) {
          setProducts(mapped);
          setActive(0);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch products"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCategoryProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (length === 0) return;
      setActive(((index % length) + length) % length);
    },
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
            {/* Loading state */}
            {isLoading && (
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
              </div>
            )}

            {/* Error state */}
            {!isLoading && error && (
              <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-neutral-500">
                Couldn&apos;t load the collection right now.
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && length === 0 && (
              <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-neutral-500">
                No products found in this collection yet.
              </div>
            )}

            {/* Slider */}
            {!isLoading &&
              !error &&
              products.map((product, index) => {
                const offset = getOffset(index, active, length);
                const isActive = offset === 0;
                const styles = getCardStyles(offset);

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
                      // Redirect to the product if clicking the center active card
                      if (isActive && product.slug) {
                        router.push(`/products/${product.slug}`);
                      } else if (offset === -1) {
                        goPrev();
                      } else if (offset === 1) {
                        goNext();
                      }
                    }}
                  >
                    <div
                      className={`relative aspect-square w-full overflow-hidden rounded-2xl bg-white transition-shadow ${
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
                        className="object-cover"
                      />
                    </div>

                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mt-4 text-center"
                      >
                        <p className="text-sm font-semibold text-neutral-900 hover:underline">
                          {product.name}
                        </p>
                        <p
                          className="mt-1 text-sm text-neutral-500"
                          dangerouslySetInnerHTML={{ __html: product.price }}
                        />
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
              disabled={isLoading || length === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white shadow-md transition hover:bg-neutral-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Next product"
              onClick={goNext}
              disabled={isLoading || length === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white shadow-md transition hover:bg-neutral-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Pagination dots */}
          {!isLoading && !error && length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              {products.map((product, index) => (
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
          )}
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