import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, SanityPost } from "@/lib/cms";
import OptimizedLazyImage from "@/components/OptimizedLazyImage";

const JournalPreview = () => {
  const { data: posts } = useQuery<SanityPost[]>({
    queryKey: ["journal-preview"],
    queryFn: fetchPosts,
  });

  const previewPosts = posts?.slice(0, 3);

  return (
    <section className="py-12 lg:py-18 bg-craft-terracotta text-craft-ivory">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold mb-6">
            From the Journal
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Stories from our artisans, insights into our craft, and reflections on sustainable living.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewPosts?.map((post, index) => (
            <Link key={post._id} to={`/journal/${post.slug.current}`} className="block group">
              <Card className="group-hover:shadow-xl transition-all duration-500 border-0 shadow-md bg-craft-ivory hover:scale-105 hover:-translate-y-2 text-foreground">
                <div className="aspect-[4/3] bg-secondary/50 rounded-t-lg relative overflow-hidden">
                {post.coverUrl ? (
                  <OptimizedLazyImage 
                    src={post.coverUrl}
                    alt={post.coverAlt || post.title}
                    context="journal"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    width={400}
                    height={300}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-craft-terracotta/30 to-craft-clay/20 group-hover:from-craft-terracotta/40 group-hover:to-craft-clay/30 transition-all duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 bg-craft-ivory/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-foreground shadow-md">
                  <span className="text-craft-terracotta">•</span> {post.readTime} min read
                </div>
                </div>
                
                <CardHeader className="pb-4 relative">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <span className="w-1.5 h-1.5 bg-craft-terracotta rounded-full"></span>
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                </div>
                <CardTitle className="font-serif text-xl group-hover:text-craft-terracotta transition-colors duration-300 leading-tight">
                  {post.title}
                </CardTitle>
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-craft-terracotta/20 to-transparent"></div>
                </CardHeader>
                
                <CardContent className="pt-0">
                <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  {post.excerpt}
                </CardDescription>
                <div className="mt-4 flex items-center text-sm font-medium text-craft-terracotta group-hover:text-craft-terracotta/80 transition-colors">
                  Read more
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
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