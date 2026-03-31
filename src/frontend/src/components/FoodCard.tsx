import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ShoppingCart } from "lucide-react";
import type { MenuItem } from "../context/AppContext";

interface FoodCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
  index?: number;
}

const categoryColors: Record<string, string> = {
  snacks: "bg-yellow-100 text-yellow-700",
  drinks: "bg-blue-100 text-blue-700",
  meals: "bg-green-100 text-green-700",
};

export function FoodCard({ item, onAddToCart, index = 1 }: FoodCardProps) {
  return (
    <div
      className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-lg transition-shadow duration-300"
      data-ocid={`menu.item.${index}`}
    >
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[item.category] || "bg-gray-100 text-gray-700"}`}
        >
          {item.category}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          <span className="font-bold text-brand-orange">₹{item.price}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
          <MapPin className="w-3 h-3" />
          <span>Campus Canteen</span>
        </div>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">
          {item.description}
        </p>
        {onAddToCart && (
          <Button
            onClick={() => onAddToCart(item)}
            className="w-full rounded-full bg-brand-orange hover:bg-orange-600 text-white text-sm"
            data-ocid={`menu.button.${index}`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
}
