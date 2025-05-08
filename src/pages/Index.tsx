import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { api, Photo } from "@/services/api";
import { PhotoCard } from "@/components/ui/photo-card";
import { ArrowRight, Image, Search, Star, User } from "lucide-react";

const Index = () => {
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setLoading(true);
        const photos = await api.getPhotos();
        setFeaturedPhotos(photos.slice(0, 6));
      } catch (error) {
        console.error("Failed to load photos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0,rgba(0,0,0,0.4)_100%)]" />
          <div className="h-full w-full">
            <img 
              src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2000" 
              alt="Nature landscape" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        
        <div className="container px-4 relative animate-fade-in">
          <div className="max-w-3xl text-center mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight animate-slide-in">
              Capture and Share Your Perfect Moments
            </h1>
            <p className="text-lg md:text-xl text-white/90 animate-slide-in" style={{animationDelay: "100ms"}}>
              SnapView is the premium platform for photographers and enthusiasts to connect through visual storytelling
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-in" style={{animationDelay: "200ms"}}>
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  <Image className="h-5 w-5" />
                  <span>Start Sharing</span>
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <span>Explore Photos</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Photos */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Photos</h2>
              <p className="text-muted-foreground max-w-lg">
                Discover stunning photography from creators around the world
              </p>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" className="gap-1">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="photo-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-md bg-muted animate-pulse h-[300px]" />
              ))
            ) : featuredPhotos.length > 0 ? (
              featuredPhotos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No photos available yet</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">A Platform Built for Visual Stories</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-background rounded-lg p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Work</h3>
              <p className="text-muted-foreground">
                Upload your best photos with full metadata support. Tell the story behind each image.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Photography</h3>
              <p className="text-muted-foreground">
                Browse a curated gallery of photos. Search by title, location, or people.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rate & Comment</h3>
              <p className="text-muted-foreground">
                Engage with content through ratings and comments. Connect with photographers.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to share your photos with the world?</h2>
            <p className="text-lg text-muted-foreground">
              Join SnapView today and become part of a growing community of photographers and enthusiasts.
            </p>
            <Link to="/auth">
              <Button size="lg" className="gap-2 px-8">
                <User className="h-5 w-5" />
                <span>Create an Account</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image className="h-6 w-6 text-primary" />
              <span className="font-semibold text-xl">SnapView</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} SnapView. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
