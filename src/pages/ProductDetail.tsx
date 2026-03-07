import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DBProduct {
  id: string;
  name: string;
  price: number;
  price_formatted: string;
  category_id: string | null;
  description: string | null;
  image_url: string | null;
  specs: string[] | null;
  categories?: { name: string } | null;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<DBProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("id", id!)
        .maybeSingle();
      setProduct(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Бүтээгдэхүүн олдсонгүй</p>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      priceFormatted: product.price_formatted,
      category: product.categories?.name ?? "",
      description: product.description ?? "",
      image: product.image_url ?? "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-6 pt-28 pb-20">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 font-display"
        >
          <ArrowLeft className="w-4 h-4" />
          Бүтээгдэхүүн
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <img
              src={product.image_url ?? ""}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-xs font-display tracking-[0.2em] text-primary/60 mb-3 uppercase">
              {product.categories?.name ?? ""}
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="font-display text-3xl font-bold text-primary mb-6">
              {product.price_formatted}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {product.specs && product.specs.length > 0 && (
              <div className="mb-8">
                <h3 className="font-display text-sm font-semibold text-foreground mb-4">
                  Техникийн үзүүлэлт
                </h3>
                <ul className="space-y-2">
                  {product.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              <Button variant="hero" size="lg" onClick={handleAdd} className="flex-1">
                <ShoppingCart className="w-5 h-5 mr-2" />
                {added ? "Нэмэгдлээ ✓" : "Сагсанд нэмэх"}
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/cart">Сагс харах</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
