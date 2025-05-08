
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (searchParams: { title?: string; location?: string; people?: string }) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchParams, setSearchParams] = useState({
    title: "",
    location: "",
    people: ""
  });
  
  const [activeFilter, setActiveFilter] = useState<"all" | "title" | "location" | "people">("all");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSearch = () => {
    if (activeFilter === "all") {
      onSearch({
        title: searchParams.title,
        location: searchParams.location,
        people: searchParams.people
      });
    } else {
      onSearch({
        [activeFilter]: searchParams[activeFilter as keyof typeof searchParams]
      });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  const clearSearch = () => {
    setSearchParams({
      title: "",
      location: "",
      people: ""
    });
    onSearch({});
  };
  
  const isSearchActive = searchParams.title || searchParams.location || searchParams.people;
  
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 space-y-3">
      <div className="flex items-center gap-2 bg-background/50 border rounded-md px-3 py-2 backdrop-blur-sm shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        
        {activeFilter === "all" || activeFilter === "title" ? (
          <Input
            name="title"
            value={searchParams.title}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search by title..."
            className="border-0 p-0 h-auto focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/70"
          />
        ) : null}
        
        {activeFilter === "all" || activeFilter === "location" ? (
          <Input
            name="location"
            value={searchParams.location}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search by location..."
            className="border-0 p-0 h-auto focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/70"
          />
        ) : null}
        
        {activeFilter === "all" || activeFilter === "people" ? (
          <Input
            name="people"
            value={searchParams.people}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search by people..."
            className="border-0 p-0 h-auto focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/70"
          />
        ) : null}
        
        {isSearchActive && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={clearSearch}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        
        <Button
          type="button"
          variant="default"
          size="sm"
          className="ml-auto flex-shrink-0"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
      
      <div className="flex items-center justify-center gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("all")}
          className="h-7 text-xs"
        >
          All Fields
        </Button>
        <Button
          variant={activeFilter === "title" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("title")}
          className="h-7 text-xs"
        >
          Title
        </Button>
        <Button
          variant={activeFilter === "location" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("location")}
          className="h-7 text-xs"
        >
          Location
        </Button>
        <Button
          variant={activeFilter === "people" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("people")}
          className="h-7 text-xs"
        >
          People
        </Button>
      </div>
    </div>
  );
}
