import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
}

const AdminMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [editing, setEditing] = useState<Member | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const fetchMembers = async () => {
    const { data } = await supabase.from("members").select("*").order("created_at", { ascending: false });
    if (data) setMembers(data);
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    const payload = { name: editing.name, email: editing.email, phone: editing.phone, notes: editing.notes };
    if (isNew) {
      await supabase.from("members").insert(payload);
    } else {
      await supabase.from("members").update(payload).eq("id", editing.id);
    }
    toast({ title: isNew ? "Гишүүн нэмэгдлээ" : "Шинэчлэгдлээ" });
    setEditing(null);
    setIsNew(false);
    fetchMembers();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("members").delete().eq("id", id);
    toast({ title: "Устгагдлаа" });
    fetchMembers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Гишүүд</h1>
        <Button variant="hero" size="sm" onClick={() => { setIsNew(true); setEditing({ id: "", name: "", email: "", phone: "", notes: "" }); }}>
          <Plus className="w-4 h-4 mr-1" /> Нэмэх
        </Button>
      </div>

      {editing && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6 mb-8">
          <div className="flex justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">{isNew ? "Шинэ гишүүн" : "Засах"}</h2>
            <button onClick={() => { setEditing(null); setIsNew(false); }}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Нэр" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="bg-secondary" />
            <Input placeholder="И-мэйл" value={editing.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className="bg-secondary" />
            <Input placeholder="Утас" value={editing.phone ?? ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="bg-secondary" />
            <Input placeholder="Тэмдэглэл" value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} className="bg-secondary" />
          </div>
          <Button variant="hero" size="sm" className="mt-4" onClick={handleSave}>Хадгалах</Button>
        </motion.div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left p-4 font-display text-muted-foreground">Нэр</th>
              <th className="text-left p-4 font-display text-muted-foreground hidden md:table-cell">И-мэйл</th>
              <th className="text-left p-4 font-display text-muted-foreground hidden md:table-cell">Утас</th>
              <th className="text-right p-4 font-display text-muted-foreground">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                <td className="p-4 text-foreground">{m.name}</td>
                <td className="p-4 text-muted-foreground hidden md:table-cell">{m.email || "-"}</td>
                <td className="p-4 text-muted-foreground hidden md:table-cell">{m.phone || "-"}</td>
                <td className="p-4 text-right">
                  <button onClick={() => { setEditing(m); setIsNew(false); }} className="text-muted-foreground hover:text-primary mr-3"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(m.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Гишүүн байхгүй</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMembers;
