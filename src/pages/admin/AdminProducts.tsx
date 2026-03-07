import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  price_formatted: string;
  category_id: string | null;
  brand_id: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProducts(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name");
    if (data) setCategories(data);
  };

  const fetchBrands = async () => {
    const { data } = await supabase.from("brands").select("id, name");
    if (data) setBrands(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, file);
    if (error) throw error;
    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(fileName);
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
      price: editing.price,
      price_formatted: editing.price.toLocaleString() + "₮",
      category_id: editing.category_id,
      brand_id: editing.brand_id,
      description: editing.description,
      image_url: imageUrl,
      is_active: editing.is_active,
    };

    if (isNew) {
      await supabase.from("products").insert(payload);
    } else {
      await supabase.from("products").update(payload).eq("id", editing.id);
    }
    toast({ title: isNew ? "Бүтээгдэхүүн нэмэгдлээ" : "Шинэчлэгдлээ" });
    setEditing(null);
    setIsNew(false);
    setImageFile(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Устгагдлаа" });
    fetchProducts();
  };

  const openNew = () => {
    setIsNew(true);
    setImageFile(null);
    setEditing({
      id: "",
      name: "",
      price: 0,
      price_formatted: "",
      category_id: null,
      brand_id: null,
      description: "",
      image_url: "",
      is_active: true,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Бүтээгдэхүүн
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
              {isNew ? "Шинэ бүтээгдэхүүн" : "Засах"}
            </h2>
            <button
              onClick={() => {
                setEditing(null);
                setIsNew(false);
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
            <Input
              type="number"
              placeholder="Үнэ"
              value={editing.price}
              onChange={(e) =>
                setEditing({ ...editing, price: Number(e.target.value) })
              }
              className="bg-secondary"
            />
            <select
              value={editing.category_id ?? ""}
              onChange={(e) =>
                setEditing({ ...editing, category_id: e.target.value || null })
              }
              className="h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground">
              <option value="">Ангилал сонгох</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={editing.brand_id ?? ""}
              onChange={(e) =>
                setEditing({ ...editing, brand_id: e.target.value || null })
              }
              className="h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground">
              <option value="">Брэнд сонгох</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
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
            <Input
              placeholder="Тайлбар"
              value={editing.description ?? ""}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
              className="bg-secondary md:col-span-2"
            />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={editing.is_active}
                onChange={(e) =>
                  setEditing({ ...editing, is_active: e.target.checked })
                }
              />
              Идэвхтэй
            </label>
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
                Үнэ
              </th>
              <th className="text-left p-4 font-display text-muted-foreground hidden md:table-cell">
                Төлөв
              </th>
              <th className="text-right p-4 font-display text-muted-foreground">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                <td className="p-4 text-foreground">{p.name}</td>
                <td className="p-4 text-primary font-semibold">
                  {p.price_formatted}
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${p.is_active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                    {p.is_active ? "Идэвхтэй" : "Идэвхгүй"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setEditing(p);
                      setIsNew(false);
                    }}
                    className="text-muted-foreground hover:text-primary mr-3">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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

export default AdminProducts;
