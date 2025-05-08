
import React from "react";
import { Link } from "react-router-dom";
import { Photo } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
interface PhotoCardProps {
  photo: Photo;
  className?: string;
}

export function PhotoCard({ photo, className = "" }: PhotoCardProps) {
  // Calculate average rating
  const avgRating = photo.ratings.length 
    ? photo.ratings.reduce((acc, curr) => acc + curr.rating, 0) / photo.ratings.length 
    : 0;
  
  // Format date
  const formattedDate = new Date(photo.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <Link to={`/photo/${photo.id}`}>
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${className}`}>
        <AspectRatio ratio={4/3} className="bg-muted">
        <img
          src={photo.url}
          alt={photo.title}
          className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <h3 className="text-white font-medium mb-1 line-clamp-1">{photo.title}</h3>
              <p className="text-white/80 text-sm line-clamp-1">{photo.caption}</p>
            </div>
          </div>
        </AspectRatio>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium line-clamp-1">{photo.title}</h3>
            {avgRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {photo.location && (
                <Badge variant="outline" className="text-xs">
                  {photo.location}
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
