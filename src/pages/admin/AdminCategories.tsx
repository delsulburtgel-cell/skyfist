import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("categories").select("*").order("created_at");
    if (data) setCategories(data);
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    const payload = { name: editing.name, slug: editing.slug };
    if (isNew) {
      await supabase.from("categories").insert(payload);
    } else {
      await supabase.from("categories").update(payload).eq("id", editing.id);
    }
    toast({ title: isNew ? "Ангилал нэмэгдлээ" : "Шинэчлэгдлээ" });
    setEditing(null);
    setIsNew(false);
    fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("categories").delete().eq("id", id);
    toast({ title: "Устгагдлаа" });
    fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Ангилал</h1>
        <Button variant="hero" size="sm" onClick={() => { setIsNew(true); setEditing({ id: "", name: "", slug: "" }); }}>
          <Plus className="w-4 h-4 mr-1" /> Нэмэх
        </Button>
      </div>

      {editing && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6 mb-8">
          <div className="flex justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">{isNew ? "Шинэ ангилал" : "Засах"}</h2>
            <button onClick={() => { setEditing(null); setIsNew(false); }}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Нэр" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="bg-secondary" />
            <Input placeholder="Slug (жнь: security)" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="bg-secondary" />
          </div>
          <Button variant="hero" size="sm" className="mt-4" onClick={handleSave}>Хадгалах</Button>
        </motion.div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left p-4 font-display text-muted-foreground">Нэр</th>
              <th className="text-left p-4 font-display text-muted-foreground">Slug</th>
              <th className="text-right p-4 font-display text-muted-foreground">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                <td className="p-4 text-foreground">{c.name}</td>
                <td className="p-4 text-muted-foreground">{c.slug}</td>
                <td className="p-4 text-right">
                  <button onClick={() => { setEditing(c); setIsNew(false); }} className="text-muted-foreground hover:text-primary mr-3"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;
