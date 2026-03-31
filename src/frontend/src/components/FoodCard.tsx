import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { MenuItem } from "../context/AppContext";

interface FoodCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  index?: number;
}

const categoryColors: Record<string, string> = {
  snacks: "bg-yellow-100 text-yellow-700",
  drinks: "bg-blue-100 text-blue-700",
  meals: "bg-green-100 text-green-700",
};

export function FoodCard({ item, onAddToCart, index = 1 }: FoodCardProps) {
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(item, qty);
      setQty(1);
    }
  };

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
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
              <span className="text-sm text-gray-600 font-medium">
                Kitane chahiye?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center shadow-sm"
                  data-ocid={`menu.qty_minus.${index}`}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-bold text-gray-900 text-base">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-7 h-7 rounded-full bg-brand-orange hover:bg-orange-600 flex items-center justify-center shadow-sm"
                  data-ocid={`menu.qty_plus.${index}`}
                >
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
            <Button
              onClick={handleAdd}
              className="w-full rounded-full bg-brand-orange hover:bg-orange-600 text-white text-sm"
              data-ocid={`menu.button.${index}`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add {qty > 1 ? `${qty} items` : "to Cart"} • ₹{item.price * qty}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
