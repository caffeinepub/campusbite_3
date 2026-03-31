import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ChefHat, Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import type { MenuItem, OrderStatus } from "../context/AppContext";

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: "Order Received",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  completed: "Completed",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  received: "bg-blue-100 text-blue-700",
  preparing: "bg-yellow-100 text-yellow-700",
  ready: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
};

export function VendorDashboard() {
  const {
    currentUser,
    orders,
    menuItems,
    updateOrderStatus,
    addMenuItem,
    removeMenuItem,
    updateMenuItem,
  } = useApp();
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "snacks" as MenuItem["category"],
    image: "",
    description: "",
  });

  if (!currentUser || currentUser.role !== "vendor") {
    navigate({ to: "/login" });
    return null;
  }

  const resetForm = () =>
    setForm({
      name: "",
      price: "",
      category: "snacks",
      image: "",
      description: "",
    });

  const handleAddItem = () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    addMenuItem({
      name: form.name,
      price: Number(form.price),
      category: form.category,
      image: form.image || `https://picsum.photos/seed/${form.name}/400/300`,
      description: form.description,
      vendorId: currentUser.id,
    });
    toast.success("Menu item added!");
    setAddOpen(false);
    resetForm();
  };

  const handleEditItem = () => {
    if (!editItem || !form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    updateMenuItem({
      ...editItem,
      name: form.name,
      price: Number(form.price),
      category: form.category,
      image: form.image || editItem.image,
      description: form.description,
    });
    toast.success("Item updated!");
    setEditItem(null);
    resetForm();
  };

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setForm({
      name: item.name,
      price: String(item.price),
      category: item.category,
      image: item.image,
      description: item.description,
    });
  };

  const activeOrders = orders.filter((o) => o.status !== "completed");
  const completedOrders = orders.filter((o) => o.status === "completed");

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Vendor Dashboard
            </h1>
            <p className="text-gray-500 text-sm">Welcome, {currentUser.name}</p>
          </div>
        </div>

        <Tabs defaultValue="orders" data-ocid="vendor.tab">
          <TabsList className="mb-6">
            <TabsTrigger value="orders" data-ocid="vendor.orders.tab">
              Active Orders ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-ocid="vendor.completed.tab">
              Completed ({completedOrders.length})
            </TabsTrigger>
            <TabsTrigger value="menu" data-ocid="vendor.menu.tab">
              My Menu ({menuItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {activeOrders.length === 0 ? (
              <div
                className="text-center py-20"
                data-ocid="vendor.orders.empty_state"
              >
                <CheckCircle2 className="w-16 h-16 text-green-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  Koi active order nahi hai
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Jab koi order ayega, yahan dikhega
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order, i) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-card p-5 border-l-4 border-brand-orange"
                    data-ocid={`vendor.orders.item.${i + 1}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-900 text-lg">
                            Order #{order.id.slice(-6).toUpperCase()}
                          </p>
                          <Badge
                            className={`${STATUS_COLORS[order.status]} border-0`}
                          >
                            {STATUS_LABELS[order.status]}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <div className="mt-3 space-y-1">
                          {order.items.map((c) => (
                            <p
                              key={c.menuItem.id}
                              className="text-sm text-gray-700 font-medium"
                            >
                              • {c.menuItem.name} × {c.quantity}
                            </p>
                          ))}
                        </div>
                        <p className="font-bold text-brand-orange mt-2 text-base">
                          ₹{order.total} &nbsp;|&nbsp; Pickup: {order.timeSlot}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <Select
                          value={order.status}
                          onValueChange={(val) => {
                            updateOrderStatus(order.id, val as OrderStatus);
                            toast.success(
                              `Status updated to: ${STATUS_LABELS[val as OrderStatus]}`,
                            );
                          }}
                        >
                          <SelectTrigger
                            className="w-48"
                            data-ocid={`vendor.orders.select.${i + 1}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="received">
                              Order Received
                            </SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="ready">
                              Ready for Pickup
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        {order.status !== "completed" && (
                          <Button
                            onClick={() => {
                              updateOrderStatus(order.id, "completed");
                              toast.success(
                                `Order #${order.id.slice(-6).toUpperCase()} completed! ✅`,
                              );
                            }}
                            className="rounded-full bg-green-500 hover:bg-green-600 text-white text-sm px-4"
                            data-ocid={`vendor.orders.complete_button.${i + 1}`}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedOrders.length === 0 ? (
              <div
                className="text-center py-20"
                data-ocid="vendor.completed.empty_state"
              >
                <p className="text-gray-500">
                  Abhi tak koi order complete nahi hua
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedOrders.map((order, i) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-card p-5 border-l-4 border-green-400 opacity-80"
                    data-ocid={`vendor.completed.item.${i + 1}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-900">
                            Order #{order.id.slice(-6).toUpperCase()}
                          </p>
                          <Badge className="bg-green-100 text-green-700 border-0">
                            ✅ Completed
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <div className="mt-2 space-y-1">
                          {order.items.map((c) => (
                            <p
                              key={c.menuItem.id}
                              className="text-sm text-gray-600"
                            >
                              {c.menuItem.name} × {c.quantity}
                            </p>
                          ))}
                        </div>
                        <p className="font-bold text-gray-500 mt-2">
                          ₹{order.total} | {order.timeSlot}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="menu">
            <div className="flex justify-end mb-4">
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="rounded-full bg-brand-orange text-white hover:bg-orange-600"
                    data-ocid="vendor.menu.open_modal_button"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent data-ocid="vendor.menu.dialog">
                  <DialogHeader>
                    <DialogTitle>Add Menu Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="mt-1"
                        data-ocid="vendor.menu.input"
                      />
                    </div>
                    <div>
                      <Label>Price (₹)</Label>
                      <Input
                        type="number"
                        value={form.price}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, price: e.target.value }))
                        }
                        className="mt-1"
                        data-ocid="vendor.menu.input"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={form.category}
                        onValueChange={(v) =>
                          setForm((f) => ({
                            ...f,
                            category: v as MenuItem["category"],
                          }))
                        }
                      >
                        <SelectTrigger
                          className="mt-1"
                          data-ocid="vendor.menu.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="snacks">Snacks</SelectItem>
                          <SelectItem value="drinks">Drinks</SelectItem>
                          <SelectItem value="meals">Meals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={form.description}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                        className="mt-1"
                        data-ocid="vendor.menu.input"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleAddItem}
                        className="flex-1 rounded-full bg-brand-orange text-white"
                        data-ocid="vendor.menu.confirm_button"
                      >
                        Add Item
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setAddOpen(false)}
                        className="flex-1 rounded-full"
                        data-ocid="vendor.menu.cancel_button"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Dialog
              open={!!editItem}
              onOpenChange={(open) => {
                if (!open) {
                  setEditItem(null);
                  resetForm();
                }
              }}
            >
              <DialogContent data-ocid="vendor.edit.dialog">
                <DialogHeader>
                  <DialogTitle>Edit Menu Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="mt-1"
                      data-ocid="vendor.edit.input"
                    />
                  </div>
                  <div>
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: e.target.value }))
                      }
                      className="mt-1"
                      data-ocid="vendor.edit.input"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) =>
                        setForm((f) => ({
                          ...f,
                          category: v as MenuItem["category"],
                        }))
                      }
                    >
                      <SelectTrigger
                        className="mt-1"
                        data-ocid="vendor.edit.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="snacks">Snacks</SelectItem>
                        <SelectItem value="drinks">Drinks</SelectItem>
                        <SelectItem value="meals">Meals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      className="mt-1"
                      data-ocid="vendor.edit.input"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleEditItem}
                      className="flex-1 rounded-full bg-brand-orange text-white"
                      data-ocid="vendor.edit.confirm_button"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditItem(null);
                        resetForm();
                      }}
                      className="flex-1 rounded-full"
                      data-ocid="vendor.edit.cancel_button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item, i) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-card p-4 flex gap-4"
                  data-ocid={`vendor.menu.item.${i + 1}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-brand-orange font-bold text-sm">
                      ₹{item.price}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {item.category}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="text-gray-400 hover:text-brand-orange"
                      data-ocid={`vendor.menu.edit_button.${i + 1}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeMenuItem(item.id);
                        toast.success("Item removed");
                      }}
                      className="text-gray-400 hover:text-red-500"
                      data-ocid={`vendor.menu.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
