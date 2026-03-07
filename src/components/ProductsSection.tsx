import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Flame, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

const ProductsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { addToCart } = useCart();

  return (
    <section id="products" className="py-24 relative" ref={ref}>
      <div className="container px-6">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <p className="text-xs font-display tracking-[0.3em] text-primary uppercase">
              Шинэ бараа
            </p>
            <Flame className="w-4 h-4 text-primary" />
          </div>
          <Link
            to="/cart"
            className="text-xs font-display tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            Сагс харах →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="glass-card rounded-xl overflow-hidden group hover:border-primary/30 transition-all duration-500"
            >
              <Link to={`/product/${product.id}`}>
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                </div>
              </Link>
              <div className="p-6">
                <p className="text-xs text-primary/60 mb-2 font-display tracking-wider">
                  {product.category}
                </p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-display text-sm font-semibold text-foreground mb-3 leading-snug hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg font-bold text-primary">
                    {product.priceFormatted}
                  </p>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
