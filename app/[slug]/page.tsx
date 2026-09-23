import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/graphql";

interface PageData {
  title: string;
  content: string;
  slug: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Page Not Found" };
  return {
    title: page.title,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  // Skip known static routes
  const staticRoutes = ["products", "collections", "checkout", "order-tracking", "policies", "our-story", "cart", "profile", "orders", "api"];
  if (staticRoutes.some((route) => slug.startsWith(route))) {
    notFound();
  }

  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <main className="bg-ivory min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-12 lg:py-24">
        <header className="mb-12 border-b border-hairline pb-8 lg:mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
            Ridhira Grace
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink lg:text-5xl">
            {page.title}
          </h1>
        </header>

        <article className="prose prose-neutral max-w-none prose-headings:font-serif prose-headings:text-ink prose-p:text-ink/75 prose-p:leading-relaxed prose-strong:text-ink prose-a:text-gold prose-a:no-underline hover:prose-a:underline">
          <div className="mt-6" dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
      </div>
    </main>
  );
}