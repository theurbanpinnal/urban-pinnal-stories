const CraftSection = () => {
  return (
    <section className="py-12 lg:py-18 bg-craft-terracotta text-craft-ivory">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-serif text-4xl lg:text-5xl font-semibold mb-12">
          Rooted in Tradition. Crafted from Nature.
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-lg lg:text-xl leading-relaxed opacity-90">
          Our commitment to authenticity runs deep. We partner with local artisans to source our natural materials,
           honoring the time-honored weaving techniques they have carried through generations. From the first pinnal
            (<span className="font-tamil-serif">பின்னல்</span>) prepared by hand to the final intricate pattern, every piece is a testament to true handcraft, 
            making it far more than just a product—it is cultural preservation, environmental responsibility, and 
            artistic excellence woven into one.
            
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-craft-ivory/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-craft-ivory" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-medium mb-3">Hand-Crafted</h3>
            <p className="text-craft-ivory/80">Every piece touched by skilled artisan hands</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-craft-ivory/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-craft-ivory" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-medium mb-3">Natural Materials</h3>
            <p className="text-craft-ivory/80">Kauna, Jute, Bamboo, Vegan Leather and Rattan</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-craft-ivory/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-craft-ivory" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-medium mb-3">Timeless Techniques</h3>
            <p className="text-craft-ivory/80">Methods passed down through generations</p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default CraftSection;