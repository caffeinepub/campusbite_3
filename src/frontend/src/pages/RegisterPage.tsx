import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import type { UserRole } from "../context/AppContext";

export function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    collegeId: "",
    password: "",
    role: "student" as UserRole,
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = register(form);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Registration failed");
      return;
    }
    toast.success(`Welcome to CampusBite, ${form.name}!`);
    navigate({ to: "/menu" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-brand-orange flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            <span>Campus</span>
            <span className="text-brand-orange">Bite</span>
          </h1>
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                className="mt-1"
                data-ocid="register.input"
              />
            </div>
            <div>
              <Label htmlFor="reg_email">Email Address</Label>
              <Input
                id="reg_email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                className="mt-1"
                data-ocid="register.input"
              />
            </div>
            <div>
              <Label htmlFor="collegeId">College ID (optional)</Label>
              <Input
                id="collegeId"
                placeholder="e.g. CS2024001"
                value={form.collegeId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, collegeId: e.target.value }))
                }
                className="mt-1"
                data-ocid="register.input"
              />
            </div>
            <div>
              <Label htmlFor="reg_password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="reg_password"
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                  data-ocid="register.input"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <Label>Role</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(["student", "faculty", "vendor"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                    className={`py-2 rounded-xl text-sm font-medium border-2 transition-colors capitalize ${
                      form.role === r
                        ? "border-brand-orange bg-orange-50 text-brand-orange"
                        : "border-gray-200 text-gray-600 hover:border-brand-orange/50"
                    }`}
                    data-ocid={`register.${r}.toggle`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            {error && (
              <p
                className="text-red-500 text-sm"
                data-ocid="register.error_state"
              >
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand-orange hover:bg-orange-600 text-white"
              data-ocid="register.submit_button"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-orange font-semibold hover:underline"
              data-ocid="register.link"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
