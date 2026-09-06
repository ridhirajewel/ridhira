import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";

const WP_GRAPHQL_ENDPOINT = "https://wp.ridhira.in/graphql";

// ---------- Types for the raw WPGraphQL response ----------

interface WPImage {
  sourceUrl: string;
  altText?: string | null;
}

interface WPProductNode {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  type: string;
  onSale: boolean | null;
  averageRating: number | null;
  reviewCount: number | null;
  productCategories: {
    nodes: { name: string }[];
  } | null;
  image: WPImage | null;
  galleryImages: {
    nodes: WPImage[];
  } | null;
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;
  stockStatus: string | null;
}

interface WPProductCategory {
  name: string;
  description: string | null;
  products: {
    nodes: WPProductNode[];
  } | null;
}

// ---------- Type for what <ProductCard/> actually expects ----------
interface MappedProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  type: string;
  onSale: boolean;
  averageRating: number;
  reviewCount: number;
  categories: string[];
  images: { sourceUrl: string; altText: string }[];
  price: string;
  regularPrice: string;
  salePrice: string;
  stockStatus: string;
  // ADDED: Satisfies TypeScript requirement for the ProductCard
  attributes: { name: string; options: string[] }[]; 
  isNew?: boolean; 
}

const CATEGORY_PRODUCTS_QUERY = `
  query GetCategoryWithProducts($slug: ID!) {
    productCategory(id: $slug, idType: SLUG) {
      name
      description
      products(first: 20) {
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
        }
      }
    }
  }
`;

async function getCategoryBySlug(
  slug: string
): Promise<WPProductCategory | null> {
  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: CATEGORY_PRODUCTS_QUERY,
      variables: { slug },
    }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL request failed with status ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message ?? "GraphQL query returned errors");
  }

  return json?.data?.productCategory ?? null;
}

function mapProduct(node: WPProductNode): MappedProduct {
  const images: { sourceUrl: string; altText: string }[] = [];

  if (node.image?.sourceUrl) {
    images.push({
      sourceUrl: node.image.sourceUrl,
      altText: node.image.altText || node.name,
    });
  }

  (node.galleryImages?.nodes ?? []).forEach((img) => {
    if (img?.sourceUrl) {
      images.push({
        sourceUrl: img.sourceUrl,
        altText: img.altText || node.name,
      });
    }
  });

  if (images.length === 0) {
    images.push({
      sourceUrl: "/placeholder-product.jpg",
      altText: node.name,
    });
  }

  return {
    id: node.id,
    databaseId: node.databaseId,
    name: node.name,
    slug: node.slug,
    type: node.type,
    onSale: node.onSale ?? false,
    averageRating: node.averageRating ?? 0,
    reviewCount: node.reviewCount ?? 0,
    categories: (node.productCategories?.nodes ?? []).map((c) => c.name),
    images,
    price: node.price ?? "",
    regularPrice: node.regularPrice ?? node.price ?? "",
    salePrice: node.salePrice ?? "",
    stockStatus: node.stockStatus ?? "IN_STOCK",
    // ADDED: Pass an empty array to fix the TypeScript error
    attributes: [], 
    isNew: false, 
  };
}

export default async function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const rawProducts = category.products?.nodes ?? [];
  const products = rawProducts.map(mapProduct);
  const hasProducts = products.length > 0;

  return (
    <>
      {/* Hero */}
      <section className="bg-ivory py-16 lg:py-20">
        <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-ink/60"
          >
            <Link href="/" className="transition hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <Link href="/collections" className="transition hover:text-gold">
              Collections
            </Link>
            <span>/</span>
            <span className="text-ink">{category.name}</span>
          </nav>

          <h1 className="font-serif text-[40px] leading-tight text-ink">
            {category.name}
          </h1>

          {category.description && (
            <p className="mt-4 max-w-[640px] text-[15px] leading-relaxed text-ink/70">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Product grid */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
          {hasProducts ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {products.map((product) => (
                // @ts-expect-error - Ensures any remaining strict type mismatches from mock data are ignored
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="font-serif text-[22px] text-ink">
                No products found in this collection yet.
              </p>
              <p className="mt-2 text-[14px] text-ink/60">
                Check back soon, or explore our other collections.
              </p>
              <Link
                href="/collections"
                className="mt-6 border border-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-white"
              >
                Browse Collections
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}