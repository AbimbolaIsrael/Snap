
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { MessagesSquare } from "lucide-react";

interface CommentFormProps {
  photoId: string;
  onCommentAdded: () => void;
}

export function CommentForm({ photoId, onCommentAdded }: CommentFormProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast({
        title: "Error",
        description: "You must be logged in to comment",
        variant: "destructive",
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await api.addComment(photoId, user.id, user.name, comment);
      
      setComment("");
      toast({
        title: "Success",
        description: "Your comment has been added",
        variant: "default",
      });
      
      onCommentAdded();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="resize-none min-h-[100px]"
      />
      <Button 
        type="submit" 
        className="gap-2"
        disabled={isSubmitting || !comment.trim()}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Submitting...
          </>
        ) : (
          <>
            <MessagesSquare className="h-4 w-4" />
            Add Comment
          </>
        )}
      </Button>
    </form>
  );
}
