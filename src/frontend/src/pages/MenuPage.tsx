import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FoodCard } from "../components/FoodCard";
import { useApp } from "../context/AppContext";

type Category = "all" | "snacks" | "drinks" | "meals";

export function MenuPage() {
  const { menuItems, addToCart } = useApp();
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");

  const filtered = menuItems.filter((item) => {
    const matchCat = category === "all" || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddToCart = (item: Parameters<typeof addToCart>[0]) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const cats: { key: Category; label: string; emoji: string }[] = [
    { key: "all", label: "All Items", emoji: "🍽️" },
    { key: "snacks", label: "Snacks", emoji: "🥙" },
    { key: "drinks", label: "Drinks", emoji: "🧃" },
    { key: "meals", label: "Meals", emoji: "🍱" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
          <p className="text-gray-500 mt-1">
            Fresh, delicious food from the campus canteen
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search for food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-full"
            data-ocid="menu.search_input"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8" data-ocid="menu.tab">
          {cats.map((c) => (
            <Button
              key={c.key}
              onClick={() => setCategory(c.key)}
              variant={category === c.key ? "default" : "outline"}
              className={`rounded-full ${
                category === c.key
                  ? "bg-brand-orange text-white hover:bg-orange-600 border-brand-orange"
                  : "border-gray-300 text-gray-700 hover:border-brand-orange hover:text-brand-orange"
              }`}
              data-ocid={`menu.${c.key}.tab`}
            >
              {c.emoji} {c.label}
            </Button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20" data-ocid="menu.empty_state">
            <p className="text-5xl mb-4">🍽️</p>
            <h3 className="text-lg font-semibold text-gray-700">
              No items found
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Try a different search or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, i) => (
              <FoodCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
                index={i + 1}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
