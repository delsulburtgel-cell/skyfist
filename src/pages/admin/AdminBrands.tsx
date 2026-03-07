import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Brand {
  id: string;
  name: string;
  image_url: string | null;
}

const AdminBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const fetchBrands = async () => {
    const { data } = await supabase
      .from("brands")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBrands(data);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `brands/${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file);
    if (error) throw error;
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSave = async () => {
    if (!editing) return;

    let imageUrl = editing.image_url;
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        toast({
          title: "Зураг байршуулахад алдаа гарлаа",
          variant: "destructive",
        });
        return;
      }
    }

    const payload = {
      name: editing.name,
      image_url: imageUrl,
    };

    if (isNew) {
      await supabase.from("brands").insert(payload);
    } else {
      await supabase.from("brands").update(payload).eq("id", editing.id);
    }
    toast({ title: isNew ? "Брэнд нэмэгдлээ" : "Шинэчлэгдлээ" });
    setEditing(null);
    setIsNew(false);
    setImageFile(null);
    fetchBrands();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("brands").delete().eq("id", id);
    toast({ title: "Устгагдлаа" });
    fetchBrands();
  };

  const openNew = () => {
    setIsNew(true);
    setImageFile(null);
    setEditing({
      id: "",
      name: "",
      image_url: "",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Брэнд
        </h1>
        <Button variant="hero" size="sm" onClick={openNew}>
          <Plus className="w-4 h-4 mr-1" /> Нэмэх
        </Button>
      </div>

      {editing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6 mb-8">
          <div className="flex justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">
              {isNew ? "Шинэ брэнд" : "Засах"}
            </h2>
            <button
              onClick={() => {
                setEditing(null);
                setIsNew(false);
                setImageFile(null);
              }}>
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Нэр"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="bg-secondary"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Зураг
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {editing.image_url && (
                <p className="text-xs text-muted-foreground mt-1">
                  Одоогийн зураг: {editing.image_url}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="hero"
            size="sm"
            className="mt-4"
            onClick={handleSave}>
            Хадгалах
          </Button>
        </motion.div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left p-4 font-display text-muted-foreground">
                Нэр
              </th>
              <th className="text-left p-4 font-display text-muted-foreground">
                Зураг
              </th>
              <th className="text-right p-4 font-display text-muted-foreground">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr
                key={b.id}
                className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                <td className="p-4 text-foreground">{b.name}</td>
                <td className="p-4">
                  {b.image_url && (
                    <img
                      src={b.image_url}
                      alt={b.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setEditing(b);
                      setIsNew(false);
                      setImageFile(null);
                    }}
                    className="text-muted-foreground hover:text-primary mr-3">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
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

export default AdminBrands;
