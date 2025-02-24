import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { IndianRupee, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  filters: {
    minPrice: number;
    maxPrice: number;
    minSize: number;
    maxSize: number;
    searchQuery: string;
  };
  onFilterChange: (filters: SearchFiltersProps["filters"]) => void;
}

const PRICE_RANGES = [
  { min: 0, max: 2000000, label: "< ₹20L" },
  { min: 2000000, max: 5000000, label: "₹20L - ₹50L" },
  { min: 5000000, max: 10000000, label: "₹50L - ₹1Cr" },
  { min: 10000000, max: 1000000000, label: "> ₹1Cr" }
];

const SQFT_RANGES = [
  { min: 0, max: 1000, label: "< 1000 sq ft" },
  { min: 1000, max: 2000, label: "1000-2000 sq ft" },
  { min: 2000, max: 5000, label: "2000-5000 sq ft" },
  { min: 5000, max: 100000, label: "> 5000 sq ft" }
];

// 1 square gaz ≈ 9 square feet
const SQGAZ_RANGES = [
  { min: 0, max: 111, label: "< 111 sq gaz" },
  { min: 111, max: 222, label: "111-222 sq gaz" },
  { min: 222, max: 555, label: "222-555 sq gaz" },
  { min: 555, max: 11111, label: "> 555 sq gaz" }
];

export default function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const [sizeUnit, setSizeUnit] = useState<"sqft" | "sqgaz">("sqft");

  const handleSizeRangeClick = (min: number, max: number) => {
    // Convert gaz to feet if needed
    const multiplier = sizeUnit === "sqgaz" ? 9 : 1;
    onFilterChange({
      ...filters,
      minSize: min * multiplier,
      maxSize: max * multiplier
    });
  };

  const currentSizeRanges = sizeUnit === "sqft" ? SQFT_RANGES : SQGAZ_RANGES;

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search by title or location..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
          className="flex-1"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <IndianRupee className="h-4 w-4" />
          <span className="text-sm font-medium">Price Range</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((range) => (
            <Button
              key={range.label}
              variant={filters.minPrice === range.min && filters.maxPrice === range.max ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange({
                ...filters,
                minPrice: range.min,
                maxPrice: range.max
              })}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <ArrowUpWideNarrow className="h-4 w-4" />
            <span className="text-sm font-medium">Size Range</span>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={sizeUnit === "sqft" ? "default" : "outline"}
              onClick={() => setSizeUnit("sqft")}
            >
              sq ft
            </Button>
            <Button
              size="sm"
              variant={sizeUnit === "sqgaz" ? "default" : "outline"}
              onClick={() => setSizeUnit("sqgaz")}
            >
              sq gaz
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentSizeRanges.map((range) => (
            <Button
              key={range.label}
              variant={
                filters.minSize === range.min * (sizeUnit === "sqgaz" ? 9 : 1) && 
                filters.maxSize === range.max * (sizeUnit === "sqgaz" ? 9 : 1) 
                  ? "default" 
                  : "outline"
              }
              size="sm"
              onClick={() => handleSizeRangeClick(range.min, range.max)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}