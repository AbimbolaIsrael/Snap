
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Upload, Image, X } from "lucide-react";

export function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    location: "",
    people: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file for later upload
      setSelectedFile(file);
      
      // Create a temporary URL for preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Upload the photo with the actual file
      await api.uploadPhoto({
        ...formData,
        url: selectedFile, // This now matches the PhotoUpload interface
        creator_id: user.id,
        creatorName: user.name
      });
      
      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });
      
      // Reset form
      setFormData({
        title: "",
        caption: "",
        location: "",
        people: "",
      });
      clearImage();
      
      // Callback to inform parent component
      onSuccess();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-center">Upload New Photo</CardTitle>
        <CardDescription className="text-center">
          Share your best moments with the world
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              {previewUrl ? (
                <div className="relative rounded-md overflow-hidden aspect-video bg-muted">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Label 
                  htmlFor="image-upload" 
                  className="flex flex-col items-center justify-center h-48 bg-muted rounded-md border-2 border-dashed border-muted-foreground/30 cursor-pointer transition-colors hover:border-muted-foreground/50"
                >
                  <Image className="h-8 w-8 mb-2 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">Click to select an image</span>
                  <span className="text-xs text-muted-foreground/70">PNG, JPG or WEBP (max 10MB)</span>
                </Label>
              )}
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Give your photo a title"
                required
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                name="caption"
                value={formData.caption}
                onChange={handleInputChange}
                placeholder="Describe your photo"
                className="resize-none"
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Where was this photo taken?"
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="people">People</Label>
              <Input
                id="people"
                name="people"
                value={formData.people}
                onChange={handleInputChange}
                placeholder="Who's in this photo?"
              />
            </div>
          </div>
        </form>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full gap-2"
          disabled={isUploading || !selectedFile}
          onClick={handleSubmit}
        >
          {isUploading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Photo
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
