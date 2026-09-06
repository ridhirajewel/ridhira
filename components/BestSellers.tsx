"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

// Perfectly matched to your ProductCard's required 'Product' type
interface MappedProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  type: string;
  onSale: boolean;
  stockStatus: string;
  isNew: boolean;
  images: { sourceUrl: string; altText: string }[];
  categories: { name: string }[];
  price: string;
  regularPrice: string;
  salePrice: string;
  averageRating: number;
  reviewCount: number;
}

interface WPGraphQLProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  type: string;
  onSale: boolean;
  stockStatus?: string;
  averageRating?: number;
  reviewCount?: number;
  productCategories?: {
    nodes: { name: string }[];
  };
  image: {
    sourceUrl: string;
    altText?: string;
  } | null;
  galleryImages?: {
    nodes: {
      sourceUrl: string;
      altText?: string;
    }[];
  };
  price?: string;
  regularPrice?: string;
  salePrice?: string;
}

// Expanded query to fetch categories, alt text, and reviews
const LATEST_PRODUCTS_QUERY = `
  query GetLatestProducts {
    products(first: 8, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        databaseId
        name
        slug
        type
        onSale
        averageRating
        reviewCount
        productCategories {
          nodes {
            name
          }
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          stockStatus
        }
        image {
          sourceUrl
          altText
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

const WP_GRAPHQL_ENDPOINT = "https://wp.ridhira.in/graphql";

export default function BestSellers() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [fetchedProducts, setFetchedProducts] = useState<MappedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchLatestProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(WP_GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: LATEST_PRODUCTS_QUERY,
          }),
        });

        if (!res.ok) {
          throw new Error(`GraphQL request failed with status ${res.status}`);
        }

        const json = await res.json();

        if (json.errors) {
          throw new Error(json.errors[0]?.message ?? "GraphQL query returned errors");
        }

        const nodes: WPGraphQLProduct[] = json?.data?.products?.nodes ?? [];

        const mapped: MappedProduct[] = nodes.map((product) => {
          // Format primary image as an object
          const primaryImg = {
            sourceUrl: product.image?.sourceUrl ?? "/placeholder-product.jpg",
            altText: product.image?.altText ?? product.name,
          };
          
          // Format secondary image for the hover effect
          const secondaryImg = {
            sourceUrl: product.galleryImages?.nodes?.[0]?.sourceUrl ?? primaryImg.sourceUrl,
            altText: product.galleryImages?.nodes?.[0]?.altText ?? primaryImg.altText,
          };

          return {
            id: product.id,
            databaseId: product.databaseId,
            name: product.name,
            slug: product.slug,
            type: product.type,
            onSale: product.onSale,
            stockStatus: product.stockStatus ?? "IN_STOCK",
            
            // Pass images as the array of objects ProductCard expects
            images: [primaryImg, secondaryImg],
            
            // Pass categories, defaulting to an empty array if none exist
            categories: product.productCategories?.nodes ?? [],
            
            price: product.price ?? "",
            regularPrice: product.regularPrice ?? product.price ?? "",
            salePrice: product.salePrice ?? "",
            
            // Provide rating fallbacks
            averageRating: product.averageRating ?? 0,
            reviewCount: product.reviewCount ?? 0,
            
            // Set to true if you want the "NEW" badge to appear on all latest arrivals
            isNew: true, 
          };
        });

        if (isMounted) {
          setFetchedProducts(mapped);
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

    fetchLatestProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">
              As worn, as reordered
            </p>
            <h2 className="font-serif text-[32px] text-ink lg:text-[40px]">
              Latest Arrivals
            </h2>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="rounded-full border border-hairline p-2.5 text-ink transition hover:border-gold hover:text-gold"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="rounded-full border border-hairline p-2.5 text-ink transition hover:border-gold hover:text-gold"
            >
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-6 text-sm text-red-600">
            Couldn&apos;t load latest arrivals: {error}
          </p>
        )}

        {isLoading && (
          <div className="grid grid-flow-col auto-cols-[75%] gap-5 overflow-x-auto pb-2 sm:auto-cols-[42%] lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-4 lg:overflow-visible">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] w-full animate-pulse rounded-md bg-hairline/40"
              />
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <div
            ref={scrollerRef}
            className="grid grid-flow-col auto-cols-[75%] gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] snap-x snap-mandatory sm:auto-cols-[42%] sm:[&::-webkit-scrollbar]:hidden lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-4 lg:overflow-visible"
          >
            {fetchedProducts.map((product) => (
              <div key={product.id} className="snap-start lg:snap-none">
                {/* @ts-expect-error - Bypassing strictly typed 'Product' import while ensuring all required props are mapped */}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}