import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Property } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import MapView from "@/components/map-view";
import { MapPin, Phone, Ruler, Home, Bath, Bed, Check, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function PropertyPage() {
  const [, params] = useRoute<{ id: string }>("/properties/:id");

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${params?.id}`],
  });

  if (isLoading || !property) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div>
              <Carousel className="w-full">
                <CarouselContent>
                  {property.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={url}
                          alt={`Property image ${index + 1}`}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              <div className="mt-6">
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  {property.location}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2 text-primary" />
                    <span>{property.propertyType}</span>
                  </div>
                  <div className="flex items-center">
                    <Ruler className="h-4 w-4 mr-2 text-primary" />
                    <span>{property.size} sq ft</span>
                  </div>
                  {property.bedrooms && (
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-2 text-primary" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-2 text-primary" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                  )}
                </div>

                <div className="text-2xl font-bold text-primary mb-6">
                  {formatCurrency(Number(property.price))}
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground">{property.description}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Property Details</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Condition:</span>
                        <Badge variant="outline">{property.condition}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Furnished:</span>
                        <Badge variant="outline">{property.furnished ? "Yes" : "No"}</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-3">Amenities</h2>
                    <div className="grid grid-cols-2 gap-2">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-3">Facilities</h2>
                    <div className="grid grid-cols-2 gap-2">
                      {property.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-3">Contact</h2>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <a href={`tel:${property.phone}`} className="hover:underline">
                        {property.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="h-[400px] rounded-lg overflow-hidden">
                <MapView
                  properties={[property]}
                  center={{ lat: Number(property.latitude), lng: Number(property.longitude) }}
                  zoom={15}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}