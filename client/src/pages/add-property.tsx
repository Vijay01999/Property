import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyForm from "@/components/property-form";
import { useAuth } from "@/hooks/use-auth";
import { Home } from "lucide-react";

export default function AddProperty() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">List Your Property</h1>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyForm userId={user!.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
