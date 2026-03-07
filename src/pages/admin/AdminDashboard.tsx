import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingCart, Users, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, members: 0, categories: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [p, o, m, c] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("members").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        products: p.count ?? 0,
        orders: o.count ?? 0,
        members: m.count ?? 0,
        categories: c.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Бүтээгдэхүүн", value: stats.products, icon: Package, color: "text-primary" },
    { label: "Захиалга", value: stats.orders, icon: ShoppingCart, color: "text-green-400" },
    { label: "Гишүүд", value: stats.members, icon: Users, color: "text-blue-400" },
    { label: "Ангилал", value: stats.categories, icon: Tag, color: "text-purple-400" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-8">Хянах самбар</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
