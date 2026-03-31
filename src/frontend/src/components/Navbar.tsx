import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LogOut,
  Menu,
  ShoppingCart,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

export function Navbar() {
  const { currentUser, logout, cart } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-brand-orange flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-white">Campus</span>
              <span className="text-brand-orange">Bite</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              data-ocid="nav.link"
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              data-ocid="nav.link"
            >
              Menu
            </Link>
            {currentUser?.role === "vendor" && (
              <Link
                to="/vendor"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                data-ocid="nav.link"
              >
                Vendor
              </Link>
            )}
            {currentUser?.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                data-ocid="nav.link"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <>
                <Link
                  to="/orders"
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  data-ocid="nav.link"
                >
                  My Orders
                </Link>
                <Link to="/cart" className="relative" data-ocid="nav.link">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-brand-orange hover:bg-white/10"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-brand-orange text-white text-xs rounded-full">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <User className="w-4 h-4" />
                  <span>{currentUser.name.split(" ")[0]}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white hover:bg-white/10"
                  data-ocid="nav.link"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="rounded-full bg-brand-orange hover:bg-orange-600 text-white"
                    data-ocid="nav.primary_button"
                  >
                    Sign Up
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-white text-white hover:bg-white hover:text-brand-dark"
                    data-ocid="nav.secondary_button"
                  >
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-brand-dark border-t border-white/10 px-4 py-4 space-y-3">
          <Link
            to="/"
            className="block text-gray-300 hover:text-white py-2"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className="block text-gray-300 hover:text-white py-2"
            onClick={() => setMobileOpen(false)}
          >
            Menu
          </Link>
          {currentUser ? (
            <>
              <Link
                to="/orders"
                className="block text-gray-300 hover:text-white py-2"
                onClick={() => setMobileOpen(false)}
              >
                My Orders
              </Link>
              <Link
                to="/cart"
                className="block text-gray-300 hover:text-white py-2"
                onClick={() => setMobileOpen(false)}
              >
                Cart ({cartCount})
              </Link>
              {currentUser.role === "vendor" && (
                <Link
                  to="/vendor"
                  className="block text-gray-300 hover:text-white py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Vendor
                </Link>
              )}
              {currentUser.role === "admin" && (
                <Link
                  to="/admin"
                  className="block text-gray-300 hover:text-white py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="block text-gray-300 hover:text-white py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button
                  size="sm"
                  className="rounded-full bg-brand-orange text-white"
                >
                  Sign Up
                </Button>
              </Link>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-white text-white"
                >
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
