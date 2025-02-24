import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import PropertyCard from "@/components/property-card";
import SearchFilters from "@/components/search-filters";
import MapView from "@/components/map-view";
import { Home, Plus, MapPin } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000000000,
    minSize: 0,
    maxSize: 100000,
    searchQuery: "",
  });

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const filteredProperties = properties.filter((property) => {
    const propertyPrice = Number(property.price);
    const propertySize = Number(property.size);

    return (
      propertyPrice >= filters.minPrice &&
      propertyPrice <= filters.maxPrice &&
      propertySize >= filters.minSize &&
      propertySize <= filters.maxSize &&
      (property.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Bareilly Property Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/properties/new">
                <Button className="hidden md:flex">
                  <Plus className="h-4 w-4 mr-2" />
                  List Your Property
                </Button>
              </Link>
              {!user && (
                <Link href="/auth">
                  <Button variant="outline">Login / Register</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[300px,1fr]">
          <div className="space-y-4">
            <SearchFilters filters={filters} onFilterChange={setFilters} />
            <div className="flex md:hidden">
              <Link href="/properties/new" className="w-full">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="inline-flex rounded-lg border bg-card p-1">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List View
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Map View
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading properties...</div>
            ) : viewMode === "list" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="h-[600px] rounded-lg overflow-hidden">
                <MapView properties={filteredProperties} />
              </div>
            )}

            {!isLoading && filteredProperties.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No properties found matching your criteria
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}