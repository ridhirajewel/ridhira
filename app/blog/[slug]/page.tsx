import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSinglePost, getAllPageSlugs } from "@/lib/graphql";

// Optional: Generates static routes at build time for speed
export async function generateStaticParams() {
  // If you have a getAllPostSlugs function, use it here. 
  // Otherwise, Next.js will dynamically render posts as they are requested.
  return []; 
}

export default async function SingleBlogPost({ params }: { params: { slug: string } }) {
  const post = await getSinglePost(params.slug);

  if (!post) {
    notFound();
  }

  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="min-h-screen bg-ivory pb-20 pt-10 lg:pt-16">
      <div className="mx-auto max-w-[800px] px-5 lg:px-10">
        
        <Link 
          href="/blog" 
          className="mb-10 inline-flex items-center text-[11px] uppercase tracking-[0.15em] text-bark/60 hover:text-gold transition-colors"
        >
          &larr; Back to Journal
        </Link>

        <header className="mb-10 text-center">
          <time className="mb-4 block text-[12px] font-medium uppercase tracking-[0.2em] text-gold">
            {date}
          </time>
          <h1 className="mb-8 font-serif text-[32px] leading-tight text-ink sm:text-[42px] lg:text-[48px]">
            {post.title}
          </h1>
        </header>

      </div>

      {post.featuredImage?.node?.sourceUrl && (
        <div className="mx-auto mb-16 max-w-[1000px] px-5 lg:px-10">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink/5">
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1000px) 100vw, 1000px"
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[700px] px-5 lg:px-10">
        {/* 
          WordPress content comes as pre-formatted HTML. 
          We use custom CSS targeting nested elements to ensure the theme matches.
        */}
        <div 
          className="wp-content space-y-6 text-[16px] leading-relaxed text-bark/90 sm:text-[17px] sm:leading-[1.8]
            [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:font-serif [&>h2]:text-[28px] [&>h2]:text-ink
            [&>h3]:mt-10 [&>h3]:mb-4 [&>h3]:font-serif [&>h3]:text-[22px] [&>h3]:text-ink
            [&>p]:mb-6 
            [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2
            [&>ol]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-2
            [&>blockquote]:my-8 [&>blockquote]:border-l-2 [&>blockquote]:border-gold [&>blockquote]:pl-6 [&>blockquote]:font-serif [&>blockquote]:text-[20px] [&>blockquote]:italic [&>blockquote]:text-ink
            [&>figure]:my-10 [&>figure>img]:w-full [&>figure>img]:h-auto
            [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-ink"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />
      </div>
    </article>
  );
}