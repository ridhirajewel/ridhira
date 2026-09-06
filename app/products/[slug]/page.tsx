import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductGallery from "./ProductGallery";
import ProductActions from "./ProductActions";

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
      ... on SimpleProduct {
        price
        regularPrice
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

  const mainImage = product.image?.sourceUrl ?? "/placeholder-product.jpg";
  const mainImageAlt = product.image?.altText ?? product.name;
  const galleryImages = product.galleryImages?.nodes ?? [];

  const hasDiscount =
    product.regularPrice &&
    product.price &&
    product.regularPrice !== product.price;

  return (
    <section className="bg-ivory py-10 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        {/* Back to shop */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.15em] text-ink/70 transition hover:text-gold"
        >
          <ArrowLeft size={15} strokeWidth={1.5} />
          Back to Shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: image gallery — 7 of 12 columns, padded so images don't stretch */}
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
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span
                  className="text-[20px] text-ink"
                  dangerouslySetInnerHTML={{ __html: product.price ?? "" }}
                />
                {hasDiscount && (
                  <span
                    className="text-[15px] text-ink/40 line-through"
                    dangerouslySetInnerHTML={{
                      __html: product.regularPrice ?? "",
                    }}
                  />
                )}
              </div>

              <div className="mt-8 border-t border-hairline pt-8">
                <ProductActions databaseId={product.databaseId} />
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
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}