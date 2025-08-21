import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const JournalPreview = () => {
  const journalPosts = [
    {
      title: "The Art of Natural Dyeing",
      excerpt: "Discover how our artisans create vibrant colors using turmeric, indigo, and pomegranate to achieve the perfect hues.",
      date: "March 15, 2024",
      readTime: "5 min read",
    },
    {
      title: "Village Chronicles: Kanchipuram",
      excerpt: "A journey into the heart of Tamil Nadu's silk weaving capital, where tradition meets contemporary design.",
      date: "March 10, 2024",
      readTime: "7 min read",
    },
    {
      title: "Sustainable Fashion, Timeless Beauty",
      excerpt: "Why choosing handmade textiles is not just a style choice, but a commitment to environmental responsibility.",
      date: "March 5, 2024",
      readTime: "4 min read",
    },
  ];

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
          {journalPosts.map((post, index) => (
            <Card key={index} className="group cursor-pointer hover:shadow-card transition-all duration-300 border-0 shadow-sm">
              <div className="aspect-[4/3] bg-secondary/50 rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-craft-terracotta/20 to-accent/20 group-hover:from-craft-terracotta/30 group-hover:to-accent/30 transition-all duration-300" />
                <div className="absolute bottom-4 left-4 bg-craft-ivory/90 px-3 py-1 rounded-full text-sm text-foreground">
                  {post.readTime}
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <div className="text-sm text-muted-foreground mb-2">{post.date}</div>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default JournalPreview;