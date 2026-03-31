import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface RequestRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}

const AdminRequests = () => {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Алдаа гарлаа", description: error.message });
    } else if (data) {
      setRequests(data as RequestRow[]);
    }

    setLoading(false);
  };

  const deleteRequest = async (id: string) => {
    const { error } = await supabase.from("requests").delete().eq("id", id);
    if (error) {
      toast({ title: "Устгахад алдаа гарлаа", description: error.message });
      return;
    }
    toast({ title: "Хүсэлт устгагдлаа" });
    setRequests((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-8">
        Холбооны хүсэлт
      </h1>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left p-4 font-display text-muted-foreground">
                Нэр
              </th>
              <th className="text-left p-4 font-display text-muted-foreground">
                И-мэйл
              </th>
              <th className="text-left p-4 font-display text-muted-foreground">
                Утас
              </th>
              <th className="text-left p-4 font-display text-muted-foreground">
                Мессеж
              </th>
              <th className="text-left p-4 font-display text-muted-foreground">
                Огноо
              </th>
              <th className="text-right p-4 font-display text-muted-foreground">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-muted-foreground">
                  Ачааллаж байна...
                </td>
              </tr>
            )}

            {!loading && requests.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-muted-foreground">
                  Хүсэлт байхгүй байна
                </td>
              </tr>
            )}

            {requests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                <td className="p-4 text-foreground">{request.name}</td>
                <td className="p-4 text-muted-foreground">{request.email}</td>
                <td className="p-4 text-muted-foreground">
                  {request.phone || "-"}
                </td>
                <td className="p-4 text-foreground max-w-xl break-words">
                  {request.message}
                </td>
                <td className="p-4 text-muted-foreground">
                  {new Date(request.created_at).toLocaleString()}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => deleteRequest(request.id)}
                    className="text-destructive hover:text-red-700"
                    aria-label="Delete request">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRequests;
