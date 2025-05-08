
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { SearchBar } from "@/components/ui/search-bar";
import { PhotoCard } from "@/components/ui/photo-card";
import { UploadForm } from "@/components/ui/upload-form";
import { useAuth } from "@/context/AuthContext";
import { api, Photo } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Upload } from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [searchParams, setSearchParams] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const fetchedPhotos = await api.getPhotos(searchParams);
      setPhotos(fetchedPhotos);
      setFilteredPhotos(fetchedPhotos);
    } catch (error) {
      console.error("Failed to load photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPhotos();
    }
  }, [isAuthenticated, searchParams]);

  const handleSearch = (params: { title?: string; location?: string; people?: string }) => {
    setSearchParams(params);
  };

  const handleUploadSuccess = () => {
    loadPhotos();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="container mx-auto max-w-7xl">
          <header className="mb-12 text-center">
            <h1 className="text-3xl font-bold mb-2">
              {user?.role === "creator" ? "Creator Dashboard" : "Explore Photos"}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {user?.role === "creator" 
                ? "Upload and manage your photos"
                : "Discover and engage with amazing photography"}
            </p>
          </header>
          
          {user?.role === "creator" ? (
            <Tabs defaultValue="gallery" className="animate-fade-in">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="gallery" className="gap-2">
                  <Search className="h-4 w-4" />
                  <span>Gallery</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="gallery" className="animate-fade-in">
                <SearchBar onSearch={handleSearch} />
                
                <div className="photo-grid py-4">
                  {isLoading ? (
                    // Skeleton loader for photos
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="rounded-md bg-muted animate-pulse h-[300px]" />
                    ))
                  ) : filteredPhotos.length > 0 ? (
                    filteredPhotos.map((photo) => (
                      <PhotoCard key={photo.id} photo={photo} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">No photos found matching your search</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="upload" className="animate-fade-in">
                <UploadForm onSuccess={handleUploadSuccess} />
              </TabsContent>
            </Tabs>
          ) : (
            <>
              <SearchBar onSearch={handleSearch} />
              
              <div className="photo-grid py-4">
                {isLoading ? (
                  // Skeleton loader for photos
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-md bg-muted animate-pulse h-[300px]" />
                  ))
                ) : filteredPhotos.length > 0 ? (
                  filteredPhotos.map((photo) => (
                    <PhotoCard key={photo.id} photo={photo} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No photos found matching your search</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
