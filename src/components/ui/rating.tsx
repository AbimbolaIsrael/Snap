
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";

interface RatingProps {
  photoId: string;
  ratings: { user_id: string; rating: number }[];
  onRatingAdded: () => void;
}

export function Rating({ photoId, ratings, onRatingAdded }: RatingProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  
  // Find existing user rating
  const userRating = user ? ratings.find(r => r.user_id === user.id)?.rating || 0 : 0;
  
  // Calculate average rating
  const avgRating = ratings.length 
    ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length 
    : 0;
  
  const handleRating = async (rating: number) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Error",
        description: "You must be logged in to rate",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await api.ratePhoto(photoId, user.id, rating);
      
      toast({
        title: "Success",
        description: "Your rating has been added",
        variant: "default",
      });
      
      onRatingAdded();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add rating",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">
        {ratings.length > 0 ? (
          <span className="flex items-center gap-1">
            <span className="text-lg font-semibold">{avgRating.toFixed(1)}</span>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-muted-foreground">({ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'})</span>
          </span>
        ) : (
          <span className="text-muted-foreground">No ratings yet</span>
        )}
      </h3>
      
      {isAuthenticated && (
        <div 
          className="flex items-center gap-1" 
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              className="relative p-1 focus:outline-none disabled:opacity-70"
            >
              <Star 
                className={`h-6 w-6 transition-all duration-100 ${
                  (hoverRating ? hoverRating >= star : userRating >= star)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {userRating > 0 ? "Your rating" : "Rate this photo"}
          </span>
        </div>
      )}
    </div>
  );
}
