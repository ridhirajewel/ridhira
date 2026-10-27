import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "@/lib/graphql";

export const metadata = {
  title: "Journal | Ridhira",
  description: "Read the latest stories, styling guides, and news from Ridhira.",
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-ivory py-16 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        
        <header className="mb-16 text-center lg:mb-24">
          <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.2em] text-gold">
            Our Journal
          </p>
          <h1 className="font-serif text-[36px] leading-tight text-ink lg:text-[48px]">
            Stories & Styling
          </h1>
        </header>

        {posts.length === 0 ? (
          <div className="text-center text-bark/60">
            <p>No journal entries found. Please check back later.</p>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const date = new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });

              return (
                <article key={post.id} className="group flex flex-col">
                  <Link href={`/blog/${post.slug}`} className="relative mb-6 aspect-[4/3] w-full overflow-hidden bg-ink/5">
                    {post.featuredImage?.node?.sourceUrl ? (
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.featuredImage.node.altText || post.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink/20">
                        <span className="font-serif italic">No Image</span>
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <time className="mb-3 text-[11px] uppercase tracking-[0.15em] text-bark/60">
                      {date}
                    </time>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="mb-3 font-serif text-[22px] leading-snug text-ink transition-colors group-hover:text-gold">
                        {post.title}
                      </h2>
                    </Link>
                    
                    {/* Excerpt comes as HTML from WP, so we render it safely */}
                    <div 
                      className="mb-6 line-clamp-3 text-[14px] leading-relaxed text-bark/80"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />

                    <Link 
                      href={`/blog/${post.slug}`}
                      className="mt-auto inline-flex items-center text-[12px] font-medium uppercase tracking-[0.15em] text-ink transition-colors hover:text-gold"
                    >
                      Read Article
                      <span className="ml-2" aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}