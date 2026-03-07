import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import techSupplyImg from "@/assets/tech-supply.jpg";
import { fadeUp } from "@/lib/animations";

interface DBProduct {
  id: string;
  name: string;
  price: number;
  price_formatted: string;
  category_id: string | null;
  brand_id: string | null;
  description: string | null;
  image_url: string | null;
  specs: string[] | null;
  is_active: boolean;
  categories?: { id: string; name: string; slug: string } | null;
  brands?: { id: string; name: string; image_url: string | null } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [prodRes, catRes] = await Promise.all([
        supabase
          .from("products")
          .select("*, categories(id, name, slug), brands(id, name, image_url)")
          .eq("is_active", true),
        supabase.from("categories").select("*"),
      ]);
      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
    };
    fetchData();
  }, []);

  const filtered = products.filter((p) => {
    const matchCategory =
      selectedCategory === "all" || p.category_id === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleAddToCart = (p: DBProduct) => {
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      priceFormatted: p.price_formatted,
      category: p.categories?.name ?? "",
      description: p.description ?? "",
      image: p.image_url ?? "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero */}
      <section className="relative pt-24">
        <div className="h-72 md:h-96 overflow-hidden relative">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src={techSupplyImg}
            alt="Products"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-center">
              <h1 className="font-display text-3xl md:text-5xl font-bold text-gradient-gold mb-4">
                Бүтээгдэхүүн
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto px-6">
                Технологийн шилдэг бүтээгдэхүүнүүдийг хамгийн сайн үнээр санал
                болгож байна
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container px-6 py-20">
        <div className="line-gradient mb-10" />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Бүтээгдэхүүн хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg text-xs font-display tracking-wide transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}>
              Бүгд
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-lg text-xs font-display tracking-wide transition-all duration-300 ${
                  selectedCategory === c.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}>
                {c.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="glass-card rounded-xl overflow-hidden group hover:border-primary/30 transition-all duration-500 hover:glow-gold">
              <Link to={`/product/${product.id}`}>
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.image_url ?? ""}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  {product.brands?.image_url && (
                    <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full p-1 shadow-md">
                      <img
                        src={product.brands.image_url}
                        alt={product.brands.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-6">
                <p className="text-xs text-primary/60 mb-2 font-display tracking-wider">
                  {product.categories?.name ?? ""}
                </p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-display text-base font-semibold text-foreground mb-2 leading-snug hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-display text-xl font-bold text-primary">
                    {product.price_formatted}
                  </p>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Нэмэх
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-display">
              Бүтээгдэхүүн олдсонгүй
            </p>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Products;
