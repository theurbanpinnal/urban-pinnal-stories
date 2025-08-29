import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'sm',
  showNumber = false,
  className,
}) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`full-${i}`}
        className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')}
      />
    );
  }

  // Half star
  if (hasHalfStar) {
    stars.push(
      <div key="half" className={cn(sizeClasses[size], 'relative')}>
        <Star className={cn(sizeClasses[size], 'fill-gray-200 text-gray-200')} />
        <div className="absolute inset-0 overflow-hidden w-1/2">
          <Star className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')} />
        </div>
      </div>
    );
  }

  // Empty stars
  const emptyStars = maxRating - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star
        key={`empty-${i}`}
        className={cn(sizeClasses[size], 'fill-gray-200 text-gray-200')}
      />
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {stars}
      </div>
      {showNumber && (
        <span className="text-sm text-muted-foreground ml-1">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;
