/**
 * WPGraphQL client for fetching WordPress/WooCommerce data.
 * Endpoint: https://wp.ridhira.in/graphql
 */

const GRAPHQL_ENDPOINT = process.env.WP_GRAPHQL_ENDPOINT || "https://wp.ridhira.in/graphql";

export async function fetchGraphQL(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join(", "));
  }
  return json.data;
}

export async function getPageBySlug(slug: string) {
  const query = `
    query GetPage($id: ID!) {
      page(id: $id, idType: URI) {
        title
        content
        slug
        date
        modified
      }
    }
  `;
  // WPGraphQL resolves pages by URI (slug path), not a "SLUG" enum variant
  const data = await fetchGraphQL(query, { id: slug }).catch(() => null);
  return data?.page ?? null;
}

export async function getAllPageSlugs() {
  const query = `
    query GetAllPageSlugs {
      pages(first: 100) {
        nodes {
          slug
        }
      }
    }
  `;
  const data = await fetchGraphQL(query);
  return data?.pages?.nodes?.map((p: { slug: string }) => p.slug) || [];
}

export interface HeroBannerFields {
  heroBanner: {
    node: {
      sourceUrl: string;
      altText: string;
    } | null;
  } | null;
  bannerHeading: string | null;
}

export async function getHeroBanner(): Promise<HeroBannerFields | null> {
  const query = `
    query HeroBanner {
      page(id: "home", idType: URI) {
        herobanner {
          heroBanner {
            node {
              sourceUrl
              altText
            }
          }
          bannerHeading
        }
      }
    }
  `;

  const data = await fetchGraphQL(query).catch(() => null);

  console.log("Hero Banner Data:", data);

  return data?.page?.herobanner ?? null;
}

export interface Category {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description?: string;
  image?: { id: string; sourceUrl: string; altText: string } | null;
  count: number;
}

export async function getCategories(): Promise<Category[]> {
  const query = `
    query GetCategories {
      productCategories(first: 50) {
        nodes {
          id
          databaseId
          name
          slug
          description
          image { id sourceUrl altText }
          count
        }
      }
    }
  `;
  const data = await fetchGraphQL(query);
  return data?.productCategories?.nodes || [];
}

export interface ProductImage {
  id: string;
  sourceUrl: string;
  altText: string;
}

export interface Product {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  type: string;
  onSale: boolean;
  averageRating?: number;
  reviewCount?: number;
  stockStatus: string;
  price: string;
  regularPrice: string;
  salePrice?: string;
  image?: ProductImage | null;
  galleryImages?: { nodes: ProductImage[] } | null;
  productCategories?: { nodes: { name: string }[] } | null;
}

export async function getProducts(first: number = 8): Promise<Product[]> {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          databaseId
          name
          slug
          type
          onSale
          averageRating
          reviewCount
          stockStatus
          price
          regularPrice
          salePrice
          image { sourceUrl altText }
          galleryImages { nodes { sourceUrl altText } }
          productCategories { nodes { name } }
        }
      }
    }
  `;
  const data = await fetchGraphQL(query, { first });
  return data?.products?.nodes || [];
}