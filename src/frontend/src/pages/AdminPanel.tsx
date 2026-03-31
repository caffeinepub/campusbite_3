import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  Shield,
  ShoppingBag,
  Trash2,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import type { OrderStatus } from "../context/AppContext";

const STATUS_COLORS: Record<OrderStatus, string> = {
  received: "bg-blue-100 text-blue-700",
  preparing: "bg-yellow-100 text-yellow-700",
  ready: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

export function AdminPanel() {
  const { currentUser, users, orders, menuItems, removeMenuItem } = useApp();
  const navigate = useNavigate();

  if (!currentUser || currentUser.role !== "admin") {
    navigate({ to: "/login" });
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm">
              System overview and management
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              val: users.length,
              icon: <Users className="w-5 h-5" />,
              color: "text-blue-600 bg-blue-50",
            },
            {
              label: "Total Orders",
              val: orders.length,
              icon: <ShoppingBag className="w-5 h-5" />,
              color: "text-orange-600 bg-orange-50",
            },
            {
              label: "Menu Items",
              val: menuItems.length,
              icon: <UtensilsCrossed className="w-5 h-5" />,
              color: "text-green-600 bg-green-50",
            },
            {
              label: "Active Orders",
              val: orders.filter((o) => o.status !== "completed").length,
              icon: <ShoppingBag className="w-5 h-5" />,
              color: "text-purple-600 bg-purple-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}
              >
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.val}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="users" data-ocid="admin.tab">
          <TabsList className="mb-6">
            <TabsTrigger value="users" data-ocid="admin.users.tab">
              Users
            </TabsTrigger>
            <TabsTrigger value="orders" data-ocid="admin.orders.tab">
              Orders
            </TabsTrigger>
            <TabsTrigger value="menu" data-ocid="admin.menu.tab">
              Menu Items
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div
              className="bg-white rounded-2xl shadow-card overflow-hidden"
              data-ocid="admin.users.table"
            >
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      College ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u, i) => (
                    <tr key={u.id} data-ocid={`admin.users.row.${i + 1}`}>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="capitalize bg-orange-50 text-orange-700 border-0">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {u.collegeId || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p
                  className="text-center text-gray-500 py-12"
                  data-ocid="admin.orders.empty_state"
                >
                  No orders yet
                </p>
              ) : (
                orders.map((order, i) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-card p-5"
                    data-ocid={`admin.orders.item.${i + 1}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.items
                            .map((c) => `${c.menuItem.name} ×${c.quantity}`)
                            .join(", ")}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Pickup: {order.timeSlot} •{" "}
                          {order.paymentMethod === "cash" ? "Cash" : "Online"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${STATUS_COLORS[order.status]} border-0`}
                        >
                          {order.status}
                        </Badge>
                        <p className="font-bold text-brand-orange">
                          ₹{order.total}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="menu">
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Item
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {menuItems.map((item, i) => (
                    <tr key={item.id} data-ocid={`admin.menu.row.${i + 1}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="font-medium text-gray-900">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="capitalize bg-gray-100 text-gray-700 border-0">
                          {item.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-bold text-brand-orange">
                        ₹{item.price}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-600"
                          onClick={() => {
                            removeMenuItem(item.id);
                            toast.success("Item removed");
                          }}
                          data-ocid={`admin.menu.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
