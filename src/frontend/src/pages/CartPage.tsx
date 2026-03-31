import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  Minus,
  Plus,
  QrCode,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

const TIME_SLOTS = [
  "8:00 AM",
  "8:15 AM",
  "8:30 AM",
  "8:45 AM",
  "9:00 AM",
  "9:15 AM",
  "9:30 AM",
  "9:45 AM",
  "10:00 AM",
  "10:15 AM",
  "10:30 AM",
  "10:45 AM",
  "11:00 AM",
  "11:15 AM",
  "11:30 AM",
  "11:45 AM",
  "12:00 PM",
  "12:15 PM",
  "12:30 PM",
  "12:45 PM",
  "1:00 PM",
  "1:15 PM",
  "1:30 PM",
  "1:45 PM",
  "2:00 PM",
  "2:15 PM",
  "2:30 PM",
  "2:45 PM",
  "3:00 PM",
  "3:15 PM",
  "3:30 PM",
  "3:45 PM",
  "4:00 PM",
  "4:15 PM",
  "4:30 PM",
  "4:45 PM",
  "5:00 PM",
  "5:15 PM",
  "5:30 PM",
  "5:45 PM",
];

export function CartPage() {
  const { cart, removeFromCart, updateCartQty, placeOrder, currentUser } =
    useApp();
  const navigate = useNavigate();
  const [timeSlot, setTimeSlot] = useState("");
  const [payment, setPayment] = useState<"cash" | "online">("cash");
  const [mobile, setMobile] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    total: number;
    timeSlot: string;
  } | null>(null);

  const subtotal = cart.reduce(
    (sum, c) => sum + c.menuItem.price * c.quantity,
    0,
  );

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      toast.error("Please login to place an order");
      navigate({ to: "/login" });
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!timeSlot) {
      toast.error("Please select a pickup time slot");
      return;
    }
    if (payment === "online" && mobile.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 800));
    const order = placeOrder({
      items: cart,
      total: subtotal,
      timeSlot,
      paymentMethod: payment,
      mobileNumber: mobile,
      status: "received",
    });
    setPlacing(false);
    setOrderSuccess({
      orderId: order.id.slice(-6).toUpperCase(),
      total: subtotal,
      timeSlot,
    });
  };

  // Order Success Screen
  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
          data-ocid="cart.success_screen"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 mb-6">
            Aapka order vendor ke paas bhej diya gaya hai. Pickup ke liye taiyar
            raho!
          </p>
          <div className="bg-orange-50 rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-bold text-gray-900">
                #{orderSuccess.orderId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Amount</span>
              <span className="font-bold text-brand-orange">
                ₹{orderSuccess.total}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pickup Time</span>
              <span className="font-bold text-gray-900">
                {orderSuccess.timeSlot}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="font-bold text-gray-900">
                {payment === "cash" ? "Cash on Delivery" : "Online Payment"}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate({ to: "/orders" })}
              className="flex-1 rounded-full bg-brand-orange text-white hover:bg-orange-600"
              data-ocid="cart.success.track_button"
            >
              Track Order
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/menu" })}
              className="flex-1 rounded-full"
              data-ocid="cart.success.menu_button"
            >
              Order More
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center" data-ocid="cart.empty_state">
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mt-2">
            Add some delicious food from our menu
          </p>
          <Link to="/menu">
            <Button
              className="mt-6 rounded-full bg-brand-orange text-white"
              data-ocid="cart.primary_button"
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((c, i) => (
              <div
                key={c.menuItem.id}
                className="bg-white rounded-2xl shadow-card p-4 flex gap-4 items-center"
                data-ocid={`cart.item.${i + 1}`}
              >
                <img
                  src={c.menuItem.image}
                  alt={c.menuItem.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {c.menuItem.name}
                  </h3>
                  <p className="text-brand-orange font-bold">
                    ₹{c.menuItem.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateCartQty(c.menuItem.id, c.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    data-ocid={`cart.secondary_button.${i + 1}`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-lg bg-gray-50 rounded-lg py-0.5">
                    {c.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQty(c.menuItem.id, c.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    data-ocid={`cart.secondary_button.${i + 1}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-bold text-gray-900 w-16 text-right">
                  ₹{c.menuItem.price * c.quantity}
                </p>
                <button
                  type="button"
                  onClick={() => removeFromCart(c.menuItem.id)}
                  className="text-red-400 hover:text-red-600 ml-2"
                  data-ocid={`cart.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 text-sm">
                {cart.map((c) => (
                  <div
                    key={c.menuItem.id}
                    className="flex justify-between text-gray-600"
                  >
                    <span>
                      {c.menuItem.name} × {c.quantity}
                    </span>
                    <span>₹{c.menuItem.price * c.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-brand-orange">₹{subtotal}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-brand-orange" />
                <h2 className="font-bold text-gray-900">Pickup Time Slot</h2>
              </div>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                data-ocid="cart.select"
              >
                <option value="">Select a time slot</option>
                {TIME_SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPayment("cash")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-colors ${payment === "cash" ? "border-brand-orange bg-orange-50 text-brand-orange" : "border-gray-200 text-gray-600 hover:border-brand-orange/40"}`}
                  data-ocid="cart.cash.toggle"
                >
                  <Banknote className="w-6 h-6" />
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPayment("online")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-colors ${payment === "online" ? "border-brand-orange bg-orange-50 text-brand-orange" : "border-gray-200 text-gray-600 hover:border-brand-orange/40"}`}
                  data-ocid="cart.online.toggle"
                >
                  <CreditCard className="w-6 h-6" />
                  Online Payment
                </button>
              </div>

              {payment === "online" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={(e) =>
                        setMobile(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      className="mt-1"
                      data-ocid="cart.input"
                    />
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-700">
                      Scan to Pay
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      ₹{subtotal} • UPI / PhonePe / GPay
                    </p>
                    <div className="mt-3 bg-gray-100 rounded-lg p-2 text-xs text-gray-500">
                      campusbite@upi
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full rounded-full bg-brand-orange hover:bg-orange-600 text-white py-3 font-semibold"
              data-ocid="cart.submit_button"
            >
              {placing ? "Placing Order..." : `Place Order • ₹${subtotal}`}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
