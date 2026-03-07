import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  LogOut,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Хянах самбар", href: "/admin", icon: LayoutDashboard },
  { label: "Бүтээгдэхүүн", href: "/admin/products", icon: Package },
  { label: "Ангилал", href: "/admin/categories", icon: Tag },
  { label: "Брэнд", href: "/admin/brands", icon: Building },
  { label: "Захиалга", href: "/admin/orders", icon: ShoppingCart },
  { label: "Гишүүд", href: "/admin/members", icon: Users },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center max-w-md">
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            Хандах эрхгүй
          </h2>
          <p className="text-muted-foreground mb-4">
            Танд админ эрх байхгүй байна.
          </p>
          <Button variant="hero" onClick={signOut}>
            Гарах
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 glass-card border-r border-border/30 p-6 flex flex-col fixed h-full z-40">
        <Link
          to="/"
          className="font-display text-lg font-bold text-gradient-gold mb-8 block">
          SF ADMIN
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display text-muted-foreground hover:text-destructive transition-colors">
          <LogOut className="w-4 h-4" />
          Гарах
        </button>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
