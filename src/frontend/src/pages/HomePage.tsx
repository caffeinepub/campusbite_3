import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { FoodCard } from "../components/FoodCard";
import { useApp } from "../context/AppContext";

export function HomePage() {
  const { menuItems, addToCart } = useApp();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const featured = menuItems.slice(0, 6);

  const handleAddToCart = (item: Parameters<typeof addToCart>[0]) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <main>
      <section className="bg-white py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest mb-3">
                Your time is our priority!
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Order Canteen Food
                <br />
                <span className="text-brand-orange">in Seconds!</span>
              </h1>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Skip the long queues at the canteen. Order your favourite food
                online and pick it up at your scheduled time slot.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/menu">
                  <Button
                    className="rounded-full bg-brand-orange hover:bg-orange-600 text-white px-8 py-3 text-base"
                    data-ocid="hero.primary_button"
                  >
                    Order Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="outline"
                    className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-base"
                    data-ocid="hero.secondary_button"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-orange" /> Quick Pickup
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-brand-orange" /> Fresh Food
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-orange" /> Secure Pay
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-brand-orange/20 rounded-3xl rotate-12 z-0" />
              <div className="absolute -bottom-6 right-12 w-32 h-32 bg-brand-orange/30 rounded-2xl -rotate-6 z-0" />
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://picsum.photos/seed/canteenhero/600/450"
                  alt="Canteen food"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
              Who are you?
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Select your role to get started with CampusBite
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {[
                {
                  role: "student",
                  label: "STUDENT",
                  desc: "Order food, track your order, and skip the queue",
                  emoji: "🎒",
                },
                {
                  role: "faculty",
                  label: "FACULTY / STAFF",
                  desc: "Priority access and special menu options for faculty",
                  emoji: "👨‍🏫",
                },
              ].map((r) => (
                <button
                  type="button"
                  key={r.role}
                  onClick={() => setSelectedRole(r.role)}
                  className={`flex items-center gap-4 p-6 bg-white rounded-2xl border-2 shadow-card hover:shadow-lg transition-all text-left ${
                    selectedRole === r.role
                      ? "border-brand-orange"
                      : "border-transparent hover:border-brand-orange/30"
                  }`}
                  data-ocid={`role.${r.role}.button`}
                >
                  <span className="text-4xl">{r.emoji}</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm tracking-wide">
                      {r.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{r.desc}</p>
                  </div>
                  {selectedRole === r.role && (
                    <ChevronRight className="ml-auto w-5 h-5 text-brand-orange" />
                  )}
                </button>
              ))}
            </div>
            {selectedRole && (
              <div className="text-center mt-6">
                <Link to="/register">
                  <Button
                    className="rounded-full bg-brand-orange hover:bg-orange-600 text-white px-8"
                    data-ocid="role.register_button"
                  >
                    Continue as {selectedRole}{" "}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: "500+", label: "Students Daily" },
              { val: "12+", label: "Menu Items" },
              { val: "15 min", label: "Avg Pickup" },
              { val: "99%", label: "Satisfaction" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-brand-orange">{s.val}</p>
                <p className="text-gray-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Today
              </h2>
              <p className="text-gray-500 mt-1">
                Most popular items from the canteen
              </p>
            </div>
            <Link to="/menu">
              <Button
                variant="outline"
                className="rounded-full border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
                data-ocid="featured.link"
              >
                View All <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <FoodCard
                  item={item}
                  onAddToCart={handleAddToCart}
                  index={i + 1}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Browse Menu",
                desc: "Explore our delicious menu with snacks, drinks, and meals",
                emoji: "🍽️",
              },
              {
                step: "02",
                title: "Place Order",
                desc: "Add to cart, choose your time slot, and pay securely",
                emoji: "📱",
              },
              {
                step: "03",
                title: "Pick Up",
                desc: "Walk to the canteen at your time, food is ready!",
                emoji: "🏃",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{s.emoji}</span>
                </div>
                <p className="text-brand-orange font-bold text-xs tracking-widest mb-2">
                  {s.step}
                </p>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-orange">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Users className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to skip the queue?
          </h2>
          <p className="text-orange-100 mb-8">
            Join thousands of students already using CampusBite
          </p>
          <Link to="/register">
            <Button
              className="rounded-full bg-white text-brand-orange hover:bg-orange-50 px-8 py-3 font-semibold"
              data-ocid="cta.primary_button"
            >
              Register Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
