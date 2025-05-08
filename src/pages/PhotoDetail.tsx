
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommentForm } from "@/components/ui/comment-form";
import { Rating } from "@/components/ui/rating";
import { api, Photo } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Calendar, MessageSquare, User, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PhotoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        setIsLoading(true);
        if (!id) return;
        
        const photoData = await api.getPhoto(id);
        setPhoto(photoData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load photo",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadPhoto();
  }, [id, navigate, toast]);

  const handleCommentAdded = async () => {
    if (!id) return;
    
    try {
      const updatedPhoto = await api.getPhoto(id);
      setPhoto(updatedPhoto);
    } catch (error) {
      console.error("Failed to refresh photo:", error);
    }
  };

  const handleRatingAdded = async () => {
    if (!id) return;
    
    try {
      const updatedPhoto = await api.getPhoto(id);
      setPhoto(updatedPhoto);
    } catch (error) {
      console.error("Failed to refresh photo:", error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="container mx-auto max-w-6xl">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-6 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          {isLoading ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted animate-pulse h-[60vh]" />
              <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </div>
          ) : photo ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-2">
                <div className="rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={photo.url} 
                    alt={photo.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                <div className="mt-8 space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{photo.title}</h1>
                    <p className="text-muted-foreground">{photo.caption}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {photo.location && (
                      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                        <MapPin className="h-3 w-3" />
                        <span>{photo.location}</span>
                      </Badge>
                    )}
                    
                    {photo.people && photo.people !== "None" && (
                      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                        <User className="h-3 w-3" />
                        <span>{photo.people}</span>
                      </Badge>
                    )}
                    
                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(photo.timestamp)}</span>
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Comments</span>
                    {photo.comments.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {photo.comments.length}
                      </Badge>
                    )}
                  </h2>
                  
                  <div className="space-y-6">
                    {photo.comments.length > 0 ? (
                      photo.comments.map((comment) => (
                        <Card key={comment.id} className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-medium">{comment.userName}</h3>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(comment.timestamp)}
                                </span>
                              </div>
                              <p className="text-muted-foreground">{comment.comment}</p>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <CommentForm 
                      photoId={photo.id} 
                      onCommentAdded={handleCommentAdded} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar>
                      <AvatarFallback>{photo.creatorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{photo.creatorName}</h3>
                      <p className="text-xs text-muted-foreground">Creator</p>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <Rating 
                      photoId={photo.id} 
                      ratings={photo.ratings} 
                      onRatingAdded={handleRatingAdded} 
                    />
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-2">Photo Details</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Uploaded on</dt>
                        <dd>{formatDate(photo.timestamp)}</dd>
                      </div>
                      {photo.location && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Location</dt>
                          <dd>{photo.location}</dd>
                        </div>
                      )}
                      {photo.people && photo.people !== "None" && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">People</dt>
                          <dd>{photo.people}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Photo not found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PhotoDetail;
