import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  ChefHat,
  Clock,
  Package,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import type { OrderStatus } from "../context/AppContext";

const STATUS_STEPS: OrderStatus[] = [
  "received",
  "preparing",
  "ready",
  "completed",
];

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  received: {
    label: "Order Received",
    color: "bg-blue-100 text-blue-700",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  preparing: {
    label: "Preparing",
    color: "bg-yellow-100 text-yellow-700",
    icon: <ChefHat className="w-4 h-4" />,
  },
  ready: {
    label: "Ready for Pickup",
    color: "bg-green-100 text-green-700",
    icon: <Package className="w-4 h-4" />,
  },
  completed: {
    label: "Completed",
    color: "bg-gray-100 text-gray-700",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: <XCircle className="w-4 h-4" />,
  },
};

export function OrdersPage() {
  const { orders, currentUser, cancelOrder } = useApp();
  const userOrders = currentUser
    ? orders.filter((o) => o.userId === currentUser.id)
    : [];

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700">
            Please login to view orders
          </h2>
          <Link to="/login">
            <Button
              className="mt-4 rounded-full bg-brand-orange text-white"
              data-ocid="orders.primary_button"
            >
              Login
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (userOrders.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center" data-ocid="orders.empty_state">
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">No orders yet</h2>
          <p className="text-gray-500 mt-2">
            Place your first order from the menu
          </p>
          <Link to="/menu">
            <Button
              className="mt-6 rounded-full bg-brand-orange text-white"
              data-ocid="orders.primary_button"
            >
              Browse Menu
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="space-y-6">
          {userOrders.map((order, i) => {
            const cfg = STATUS_CONFIG[order.status];
            const isCancelled = order.status === "cancelled";
            const isTerminal = order.status === "completed" || isCancelled;
            const stepIdx = STATUS_STEPS.indexOf(order.status);
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-card p-6"
                data-ocid={`orders.item.${i + 1}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Order #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    className={`flex items-center gap-1 ${cfg.color} border-0`}
                  >
                    {cfg.icon} {cfg.label}
                  </Badge>
                </div>

                {/* Progress Bar - only for non-cancelled orders */}
                {!isCancelled && (
                  <div className="flex items-center gap-1 mb-5">
                    {STATUS_STEPS.map((s, idx) => (
                      <div
                        key={s}
                        className="flex items-center flex-1 last:flex-none"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            idx <= stepIdx
                              ? "bg-brand-orange text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {idx < stepIdx ? "✓" : idx + 1}
                        </div>
                        {idx < STATUS_STEPS.length - 1 && (
                          <div
                            className={`h-1 flex-1 mx-1 rounded ${
                              idx < stepIdx ? "bg-brand-orange" : "bg-gray-100"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((c) => (
                    <div
                      key={c.menuItem.id}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>
                        {c.menuItem.name} × {c.quantity}
                      </span>
                      <span>₹{c.menuItem.price * c.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" /> Pickup: {order.timeSlot}
                  </div>
                  <div className="font-bold text-brand-orange">
                    Total: ₹{order.total}
                  </div>
                </div>

                {/* Cancel Order Button */}
                {!isTerminal && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
                      onClick={() => cancelOrder(order.id)}
                      data-ocid={`orders.delete_button.${i + 1}`}
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Order
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
