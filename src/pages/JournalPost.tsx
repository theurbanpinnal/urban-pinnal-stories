import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug, SanityPost } from "@/lib/cms";
import PortableText from "react-portable-text";

const JournalPost = () => {
  const { slug } = useParams();

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<SanityPost | null>({
    queryKey: ["journal-post", slug],
    queryFn: () => fetchPostBySlug(slug as string),
    enabled: !!slug,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          {isLoading && <p className="text-center text-muted-foreground">Loading…</p>}
          {isError && <p className="text-center text-destructive">Unable to fetch the article.</p>}

          {post && (
            <>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">{post.title}</h1>
              <div className="text-sm text-muted-foreground mb-8">
                {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {post.readTime && ` • ${post.readTime} min read`}
              </div>

              {post.coverUrl && (
                <img
                  src={post.coverUrl}
                  alt={post.title}
                  className="w-full h-[340px] object-cover rounded-lg mb-10"
                />
              )}

              {post.body && (
                <div className="prose lg:prose-lg max-w-none text-foreground">
                  <PortableText content={post.body} />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JournalPost;
