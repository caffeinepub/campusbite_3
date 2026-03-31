import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "student" | "faculty" | "vendor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  collegeId?: string;
  role: UserRole;
  password: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: "snacks" | "drinks" | "meals";
  image: string;
  description: string;
  vendorId?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  timeSlot: string;
  paymentMethod: "cash" | "online";
  mobileNumber?: string;
  status: OrderStatus;
  createdAt: string;
}

const INITIAL_MENU: MenuItem[] = [
  {
    id: "1",
    name: "Samosa",
    price: 15,
    category: "snacks",
    image: "/assets/generated/samosa.dim_400x300.jpg",
    description: "Crispy fried pastry with spiced potato filling",
  },
  {
    id: "2",
    name: "Bread Pakora",
    price: 20,
    category: "snacks",
    image: "/assets/generated/bread-pakora.dim_400x300.jpg",
    description: "Golden bread fritters with green chutney",
  },
  {
    id: "3",
    name: "Veg Puff",
    price: 18,
    category: "snacks",
    image: "/assets/generated/veg-puff.dim_400x300.jpg",
    description: "Flaky puff pastry with mixed vegetable filling",
  },
  {
    id: "4",
    name: "Aloo Tikki",
    price: 25,
    category: "snacks",
    image: "/assets/generated/aloo-tikki.dim_400x300.jpg",
    description: "Spiced potato patties with tamarind chutney",
  },
  {
    id: "13",
    name: "Pav Bhaji",
    price: 45,
    category: "snacks",
    image: "/assets/generated/pav-bhaji.dim_400x300.jpg",
    description: "Spiced mashed vegetable curry with buttered pav",
  },
  {
    id: "14",
    name: "Dhokla",
    price: 30,
    category: "snacks",
    image: "/assets/generated/dhokla.dim_400x300.jpg",
    description: "Soft steamed Gujarati snack with green chutney",
  },
  {
    id: "15",
    name: "Paneer Tikka",
    price: 80,
    category: "snacks",
    image: "/assets/generated/paneer-tikka.dim_400x300.jpg",
    description: "Grilled cottage cheese with bell peppers and mint chutney",
  },
  {
    id: "21",
    name: "Poha",
    price: 20,
    category: "snacks",
    image: "/assets/generated/poha.dim_400x300.jpg",
    description: "Fluffy flattened rice with onions, peanuts and curry leaves",
  },
  {
    id: "22",
    name: "Upma",
    price: 25,
    category: "snacks",
    image: "/assets/generated/upma.dim_400x300.jpg",
    description: "Savory semolina porridge with vegetables and mustard seeds",
  },
  {
    id: "23",
    name: "Maggi",
    price: 30,
    category: "snacks",
    image: "/assets/generated/maggi.dim_400x300.jpg",
    description: "Classic instant noodles with masala, a canteen favorite",
  },
  {
    id: "5",
    name: "Masala Chai",
    price: 10,
    category: "drinks",
    image: "/assets/generated/masala-chai.dim_400x300.jpg",
    description: "Aromatic spiced Indian milk tea",
  },
  {
    id: "6",
    name: "Cold Coffee",
    price: 35,
    category: "drinks",
    image: "/assets/generated/cold-coffee.dim_400x300.jpg",
    description: "Chilled blended coffee with ice cream",
  },
  {
    id: "7",
    name: "Lassi",
    price: 30,
    category: "drinks",
    image: "/assets/generated/lassi.dim_400x300.jpg",
    description: "Creamy yogurt-based sweet drink",
  },
  {
    id: "8",
    name: "Lemon Soda",
    price: 20,
    category: "drinks",
    image: "/assets/generated/lemon-soda.dim_400x300.jpg",
    description: "Refreshing fizzy lemon soda with mint",
  },
  {
    id: "16",
    name: "Mango Shake",
    price: 50,
    category: "drinks",
    image: "/assets/generated/mango-shake.dim_400x300.jpg",
    description: "Thick creamy mango milkshake with fresh mangoes",
  },
  {
    id: "17",
    name: "Chaas",
    price: 15,
    category: "drinks",
    image: "/assets/generated/chaas.dim_400x300.jpg",
    description: "Refreshing spiced Indian buttermilk",
  },
  {
    id: "24",
    name: "Nimbu Paani",
    price: 20,
    category: "drinks",
    image: "/assets/generated/nimbu-paani.dim_400x300.jpg",
    description: "Fresh lemon water with salt, sugar and mint",
  },
  {
    id: "9",
    name: "Dal Rice",
    price: 60,
    category: "meals",
    image: "/assets/generated/dal-rice.dim_400x300.jpg",
    description: "Comfort dal served with steamed basmati rice",
  },
  {
    id: "10",
    name: "Rajma Chawal",
    price: 70,
    category: "meals",
    image: "/assets/generated/rajma-chawal.dim_400x300.jpg",
    description: "Kidney bean curry with fluffy white rice",
  },
  {
    id: "11",
    name: "Chole Bhature",
    price: 55,
    category: "meals",
    image: "/assets/generated/chole-bhature.dim_400x300.jpg",
    description: "Spicy chickpea curry with puffy fried bread",
  },
  {
    id: "12",
    name: "Veg Thali",
    price: 80,
    category: "meals",
    image: "/assets/generated/veg-thali.dim_400x300.jpg",
    description: "Complete meal with dal, sabzi, roti & rice",
  },
  {
    id: "18",
    name: "Veg Biryani",
    price: 90,
    category: "meals",
    image: "/assets/generated/veg-biryani.dim_400x300.jpg",
    description: "Fragrant basmati rice with mixed vegetables and spices",
  },
  {
    id: "19",
    name: "Idli Sambar",
    price: 45,
    category: "meals",
    image: "/assets/generated/idli-sambar.dim_400x300.jpg",
    description: "Soft steamed rice cakes with hot lentil sambar",
  },
  {
    id: "20",
    name: "Paneer Butter Masala",
    price: 100,
    category: "meals",
    image: "/assets/generated/paneer-butter-masala.dim_400x300.jpg",
    description: "Rich creamy tomato gravy with paneer, served with roti",
  },
  {
    id: "25",
    name: "Paratha",
    price: 40,
    category: "meals",
    image: "/assets/generated/paratha.dim_400x300.jpg",
    description: "Whole wheat flatbread stuffed with spiced potato filling",
  },
  {
    id: "26",
    name: "Chana Masala",
    price: 65,
    category: "meals",
    image: "/assets/generated/chana-masala.dim_400x300.jpg",
    description: "Spicy chickpea curry served with rice or roti",
  },
];

const INITIAL_USERS: User[] = [
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@campusbite.com",
    role: "admin",
    password: "admin123",
  },
  {
    id: "vendor1",
    name: "Canteen Owner",
    email: "vendor@campusbite.com",
    role: "vendor",
    password: "vendor123",
  },
];

function loadLS<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val));
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  login: (email: string, password: string) => User | null;
  logout: () => void;
  register: (data: Omit<User, "id">) => { success: boolean; error?: string };
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQty: (itemId: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (order: Omit<Order, "id" | "userId" | "createdAt">) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  removeMenuItem: (itemId: string) => void;
  updateMenuItem: (item: MenuItem) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadLS("cb_user", null),
  );
  const [users, setUsers] = useState<User[]>(() =>
    loadLS("cb_users", INITIAL_USERS),
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    // Always sync with INITIAL_MENU to pick up new items and fresh images
    const stored = loadLS<MenuItem[]>("cb_menu", []);
    const storedIds = stored.map((i) => i.id);
    const newItems = INITIAL_MENU.filter((m) => !storedIds.includes(m.id));
    const updated = stored.map((item) => {
      const fresh = INITIAL_MENU.find((m) => m.id === item.id);
      return fresh ? { ...item, image: fresh.image } : item;
    });
    return [...updated, ...newItems];
  });
  const [cart, setCart] = useState<CartItem[]>(() => loadLS("cb_cart", []));
  const [orders, setOrders] = useState<Order[]>(() => loadLS("cb_orders", []));

  useEffect(() => {
    saveLS("cb_user", currentUser);
  }, [currentUser]);
  useEffect(() => {
    saveLS("cb_users", users);
  }, [users]);
  useEffect(() => {
    saveLS("cb_menu", menuItems);
  }, [menuItems]);
  useEffect(() => {
    saveLS("cb_cart", cart);
  }, [cart]);
  useEffect(() => {
    saveLS("cb_orders", orders);
  }, [orders]);

  const login = (email: string, password: string): User | null => {
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (user) setCurrentUser(user);
    return user || null;
  };

  const logout = () => setCurrentUser(null);

  const register = (
    data: Omit<User, "id">,
  ): { success: boolean; error?: string } => {
    if (users.find((u) => u.email === data.email)) {
      return { success: false, error: "Email already registered" };
    }
    const newUser: User = { ...data, id: `user_${Date.now()}` };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing)
        return prev.map((c) =>
          c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) =>
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));

  const updateCartQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.menuItem.id === itemId ? { ...c, quantity: qty } : c)),
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = (
    data: Omit<Order, "id" | "userId" | "createdAt">,
  ): Order => {
    const order: Order = {
      ...data,
      id: `order_${Date.now()}`,
      userId: currentUser?.id || "guest",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o)),
    );
  };

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    setMenuItems((prev) => [...prev, { ...item, id: `menu_${Date.now()}` }]);
  };

  const removeMenuItem = (itemId: string) =>
    setMenuItems((prev) => prev.filter((m) => m.id !== itemId));

  const updateMenuItem = (item: MenuItem) =>
    setMenuItems((prev) => prev.map((m) => (m.id === item.id ? item : m)));

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        menuItems,
        cart,
        orders,
        login,
        logout,
        register,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        addMenuItem,
        removeMenuItem,
        updateMenuItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
