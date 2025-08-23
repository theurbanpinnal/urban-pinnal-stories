const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-craft-gold mb-4"></div>
        <p className="text-muted-foreground text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
