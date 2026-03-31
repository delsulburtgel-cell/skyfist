import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  img: string | null;
}

const AdminMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [editing, setEditing] = useState<Member | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMembers(data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `members/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("members")
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: "Зураг оруулахад алдаа гарлаа", variant: "destructive" });
      return null;
    }

    const { data } = supabase.storage.from("members").getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!editing) return;

    setUploading(true);
    let imgUrl = editing.img;

    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        imgUrl = uploadedUrl;
      }
    }

    const payload = {
      name: editing.name,
      email: editing.email,
      phone: editing.phone,
      notes: editing.notes,
      img: imgUrl,
    };

    if (isNew) {
      await supabase.from("members").insert(payload);
    } else {
      await supabase.from("members").update(payload).eq("id", editing.id);
    }

    toast({ title: isNew ? "Гишүүн нэмэгдлээ" : "Шинэчлэгдлээ" });
    setEditing(null);
    setIsNew(false);
    setImageFile(null);
    setUploading(false);
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
        <h1 className="font-display text-2xl font-bold text-foreground">
          Гишүүд
        </h1>
        <Button
          variant="hero"
          size="sm"
          onClick={() => {
            setIsNew(true);
            setEditing({
              id: "",
              name: "",
              email: "",
              phone: "",
              notes: "",
              img: null,
            });
          }}>
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
              {isNew ? "Шинэ гишүүн" : "Засах"}
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
              placeholder="И-мэйл"
              value={editing.email ?? ""}
              onChange={(e) =>
                setEditing({ ...editing, email: e.target.value })
              }
              className="bg-secondary"
            />
            <Input
              placeholder="Утас"
              value={editing.phone ?? ""}
              onChange={(e) =>
                setEditing({ ...editing, phone: e.target.value })
              }
              className="bg-secondary"
            />
            <Input
              placeholder="Тэмдэглэл"
              value={editing.notes ?? ""}
              onChange={(e) =>
                setEditing({ ...editing, notes: e.target.value })
              }
              className="bg-secondary"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Зураг</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Зураг сонгох
                </Button>
                {imageFile && (
                  <span className="text-sm text-muted-foreground">
                    {imageFile.name}
                  </span>
                )}
                {editing.img && !imageFile && (
                  <div className="flex items-center gap-2">
                    <img
                      src={editing.img}
                      alt="Current"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-muted-foreground">
                      Одоогийн зураг
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="hero"
            size="sm"
            className="mt-4"
            onClick={handleSave}
            disabled={uploading}>
            {uploading ? "Оруулж байна..." : "Хадгалах"}
          </Button>
        </motion.div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left p-4 font-display text-muted-foreground">
                Зураг
              </th>
              <th className="text-left p-4 font-display text-muted-foreground">
                Нэр
              </th>
              <th className="text-left p-4 font-display text-muted-foreground hidden md:table-cell">
                И-мэйл
              </th>
              <th className="text-left p-4 font-display text-muted-foreground hidden md:table-cell">
                Утас
              </th>
              <th className="text-right p-4 font-display text-muted-foreground">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr
                key={m.id}
                className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  {m.img ? (
                    <img
                      src={m.img}
                      alt={m.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                      {m.name.charAt(0)}
                    </div>
                  )}
                </td>
                <td className="p-4 text-foreground">{m.name}</td>
                <td className="p-4 text-muted-foreground hidden md:table-cell">
                  {m.email || "-"}
                </td>
                <td className="p-4 text-muted-foreground hidden md:table-cell">
                  {m.phone || "-"}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setEditing(m);
                      setIsNew(false);
                    }}
                    className="text-muted-foreground hover:text-primary mr-3">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground">
                  Гишүүн байхгүй
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMembers;
