import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, SanityPost } from "@/lib/cms";
import LazyImage from "@/components/LazyImage";

const JournalPreview = () => {
  const { data: posts } = useQuery<SanityPost[]>({
    queryKey: ["journal-preview"],
    queryFn: fetchPosts,
  });

  const previewPosts = posts?.slice(0, 3);

  return (
    <section className="py-20 lg:py-28 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            From the Journal
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stories from our artisans, insights into our craft, and reflections on sustainable living.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewPosts?.map((post) => (
            <Link key={post._id} to={`/journal/${post.slug.current}`} className="block group">
              <Card className="group-hover:shadow-card transition-all duration-300 border-0 shadow-sm">
                <div className="aspect-[4/3] bg-secondary/50 rounded-t-lg relative overflow-hidden">
                {post.coverUrl ? (
                  <LazyImage 
                    src={post.coverUrl}
                    alt={post.coverAlt || post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-craft-terracotta/20 to-accent/20 group-hover:from-craft-terracotta/30 group-hover:to-accent/30 transition-all duration-300" />
                )}
                <div className="absolute bottom-4 left-4 bg-craft-ivory/90 px-3 py-1 rounded-full text-sm text-foreground">
                  {post.readTime} min read
                </div>
                </div>
                
                <CardHeader className="pb-4">
                <div className="text-sm text-muted-foreground mb-2">{new Date(post.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</div>
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
      </div>
    </section>
  );
};

export default JournalPreview;