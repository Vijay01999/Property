import { Link } from "wouter";
import { Property } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { MapPin, Ruler } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <AspectRatio ratio={16 / 9}>
        <img
          src={property.imageUrls[0]}
          alt={property.title}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{property.title}</h3>
        <div className="flex items-center text-muted-foreground text-sm mb-2">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="line-clamp-1">{property.location}</span>
        </div>
        <div className="flex items-center text-muted-foreground text-sm">
          <Ruler className="h-4 w-4 mr-2" />
          <span>{property.size} sq ft</span>
        </div>
        <div className="mt-4 text-xl font-bold text-primary">
          {formatCurrency(Number(property.price))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/properties/${property.id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
