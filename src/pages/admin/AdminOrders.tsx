import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, X } from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  status: string;
  total_price: number;
  notes: string | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  completed: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { toast } = useToast();

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  useEffect(() => { fetchOrders(); }, []);

  const viewOrder = async (order: Order) => {
    setSelectedOrder(order);
    const { data } = await supabase.from("order_items").select("*").eq("order_id", order.id);
    if (data) setOrderItems(data);
  };

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    toast({ title: "Төлөв шинэчлэгдлээ" });
    fetchOrders();
    if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status });
  };

  const formatPrice = (p: number) => p.toLocaleString() + "₮";

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-8">Захиалга</h1>

      {selectedOrder && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6 mb-8">
          <div className="flex justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Захиалгын дэлгэрэнгүй</h2>
            <button onClick={() => setSelectedOrder(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
            <div><span className="text-muted-foreground">Нэр:</span> <span className="text-foreground ml-2">{selectedOrder.customer_name}</span></div>
            <div><span className="text-muted-foreground">Утас:</span> <span className="text-foreground ml-2">{selectedOrder.customer_phone}</span></div>
            <div><span className="text-muted-foreground">И-мэйл:</span> <span className="text-foreground ml-2">{selectedOrder.customer_email || "-"}</span></div>
            <div><span className="text-muted-foreground">Нийт:</span> <span className="text-primary font-bold ml-2">{formatPrice(selectedOrder.total_price)}</span></div>
          </div>
          <div className="flex gap-2 mb-4">
            {["pending", "confirmed", "completed", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(selectedOrder.id, s)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${selectedOrder.status === s ? statusColors[s] : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                {s === "pending" ? "Хүлээгдэж буй" : s === "confirmed" ? "Баталгаажсан" : s === "completed" ? "Дууссан" : "Цуцлагдсан"}
              </button>
            ))}
          </div>
          {orderItems.length > 0 && (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/30">
                <th className="text-left p-2 text-muted-foreground">Бүтээгдэхүүн</th>
                <th className="text-left p-2 text-muted-foreground">Тоо</th>
                <th className="text-right p-2 text-muted-foreground">Үнэ</th>
              </tr></thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item.id} className="border-b border-border/20">
                    <td className="p-2 text-foreground">{item.product_name}</td>
                    <td className="p-2 text-foreground">{item.quantity}</td>
                    <td className="p-2 text-right text-primary">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left p-4 font-display text-muted-foreground">Захиалагч</th>
              <th className="text-left p-4 font-display text-muted-foreground hidden md:table-cell">Утас</th>
              <th className="text-left p-4 font-display text-muted-foreground">Нийт</th>
              <th className="text-left p-4 font-display text-muted-foreground">Төлөв</th>
              <th className="text-right p-4 font-display text-muted-foreground">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                <td className="p-4 text-foreground">{o.customer_name}</td>
                <td className="p-4 text-muted-foreground hidden md:table-cell">{o.customer_phone}</td>
                <td className="p-4 text-primary font-semibold">{formatPrice(o.total_price)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[o.status] || "bg-secondary text-muted-foreground"}`}>
                    {o.status === "pending" ? "Хүлээгдэж буй" : o.status === "confirmed" ? "Баталгаажсан" : o.status === "completed" ? "Дууссан" : "Цуцлагдсан"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => viewOrder(o)} className="text-muted-foreground hover:text-primary"><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Захиалга байхгүй</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
