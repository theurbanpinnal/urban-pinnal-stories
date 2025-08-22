import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPosts, SanityPost } from "@/lib/cms";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Journal = () => {
  const { data: posts, isLoading, isError } = useQuery<SanityPost[]>({
    queryKey: ["journal-posts"],
    queryFn: fetchPosts,
  });

  return (
    <>
      {/* SEO Meta Tags */}
      <title>Journal - The Urban Pinnal | Artisan Stories & Sustainable Living</title>
      <meta
        name="description"
        content="Read stories from Tamil Nadu artisans, sustainable living tips, and behind-the-scenes insights from The Urban Pinnal craft collective."
      />

      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">Journal</h1>
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Stories from our artisans, insights into sustainable living, and reflections on craft, heritage, and mindful creation.
            </p>
          </div>
        </section>

        <section className="py-20 px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            {isLoading && <p className="text-center text-muted-foreground">Loading stories…</p>}
            {isError && <p className="text-center text-destructive">Unable to fetch stories. Please try again later.</p>}

            {posts && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link key={post._id} to={`/journal/${post.slug.current}`} className="block group">
                    <Card className="group-hover:shadow-card transition-all duration-300 border-0 shadow-sm">
                      <div className="aspect-[4/3] bg-secondary/50 rounded-t-lg relative overflow-hidden">
                        {post.coverUrl && (
                          <img
                            src={post.coverUrl}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute bottom-4 left-4 bg-craft-ivory/90 px-3 py-1 rounded-full text-sm text-foreground">
                          {post.readTime} min read
                        </div>
                      </div>

                      <CardHeader className="pb-4">
                        <div className="text-sm text-muted-foreground mb-2">
                          {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <CardDescription className="text-base leading-relaxed">
                          {post.excerpt}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Journal;
