import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "./ProductGallery";
import ProductActions from "./ProductActions";
import footer from "@/components/Footer";
import Footer from "@/components/Footer";

const WP_GRAPHQL_ENDPOINT = "https://wp.ridhira.in/graphql";

interface GalleryImage {
  sourceUrl: string;
  altText?: string;
}

interface WPProduct {
  databaseId: number;
  name: string;
  slug: string;
  description: string;
  price: string | null;
  regularPrice: string | null;
  stockStatus: string | null;
  productCategories: {
    nodes: { name: string; slug: string }[];
  } | null;
  image: {
    sourceUrl: string;
    altText?: string;
  } | null;
  galleryImages: {
    nodes: GalleryImage[];
  } | null;
}

const SINGLE_PRODUCT_QUERY = `
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      databaseId
      name
      slug
      productCategories {
        nodes { name slug }
      }
      ... on SimpleProduct {
        price
        regularPrice
        stockStatus
        description
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
      ... on VariableProduct {
        price
        regularPrice
        stockStatus
        description
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

async function getProductBySlug(slug: string): Promise<WPProduct | null> {
  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: SINGLE_PRODUCT_QUERY,
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

  return json?.data?.product ?? null;
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // TypeScript narrowing — notFound() throws, so product is non-null here
  const p = product!;

  const mainImage = p.image?.sourceUrl ?? "/placeholder-product.jpg";
  const mainImageAlt = p.image?.altText ?? p.name;
  const galleryImages = p.galleryImages?.nodes ?? [];
  const category = p.productCategories?.nodes?.[0];
  const isOutOfStock = p.stockStatus === "OUT_OF_STOCK";

  const hasDiscount =
    p.regularPrice &&
    p.price &&
    p.regularPrice !== p.price;

  return (
    <>
    <section className="bg-ivory py-10 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink/50">
          <Link href="/" className="hover:text-gold transition">Home</Link>
          <span aria-hidden="true">/</span>
          {category ? (
            <>
              <Link
                href={`/collections/${category.slug}`}
                className="hover:text-gold transition"
              >
                {category.name}
              </Link>
              <span aria-hidden="true">/</span>
            </>
          ) : null}
          <span className="text-ink/80">{p.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: image gallery — 7 of 12 columns */}
          <div className="lg:col-span-7 lg:pr-6">
            <ProductGallery
              mainImage={mainImage}
              mainImageAlt={mainImageAlt}
              galleryImages={galleryImages}
            />
          </div>

          {/* Right: product details — 5 of 12 columns, sticky while scrolling gallery */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <h1 className="font-serif text-[30px] leading-tight text-ink lg:text-[38px]">
                {p.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span
                  className="text-[20px] text-ink"
                  dangerouslySetInnerHTML={{ __html: p.price ?? "" }}
                />
                {hasDiscount && (
                  <span
                    className="text-[15px] text-ink/40 line-through"
                    dangerouslySetInnerHTML={{
                      __html: p.regularPrice ?? "",
                    }}
                  />
                )}
              </div>

              {isOutOfStock && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-oxblood/30 bg-oxblood/10 px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-oxblood">
                  Out of Stock
                </p>
              )}

              <div className="mt-8 border-t border-hairline pt-8">
                <ProductActions
                  databaseId={p.databaseId}
                  stockStatus={p.stockStatus ?? "IN_STOCK"}
                />
              </div>

              {/* Description with accordion support */}
              <div
                className="
                  prose prose-sm mt-10 max-w-none border-t border-hairline pt-8 text-ink
                  prose-headings:font-serif prose-headings:text-ink
                  prose-p:text-ink/80 prose-p:leading-relaxed
                  prose-a:text-gold prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-ink

                  [&_details]:border-b [&_details]:border-hairline [&_details]:py-4
                  [&_details:first-of-type]:border-t
                  [&_summary]:cursor-pointer [&_summary]:list-none
                  [&_summary]:font-serif [&_summary]:text-[16px] [&_summary]:text-ink
                  [&_summary]:flex [&_summary]:items-center [&_summary]:justify-between
                  [&_summary::-webkit-details-marker]:hidden
                  [&_details[open]_summary]:text-gold
                "
                dangerouslySetInnerHTML={{ __html: p.description }}
              />
            </div>
          </div>
        </div>
      </div>
      
    </section>
    <Footer />
    </>
  );
}