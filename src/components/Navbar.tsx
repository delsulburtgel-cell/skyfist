import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/sf-logo.png";

const navItems = [
  { label: "БИДНИЙ ТУХАЙ", href: "/#about" },
  { label: "ҮЙЛЧИЛГЭЭ", href: "/#services" },
  { label: "ДЭЛГҮҮР", href: "/products", isLink: true },
  { label: "ХОЛБОО БАРИХ", href: "/contact", isLink: true },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-card fixed top-4 left-0 right-0 mx-auto rounded-2xl z-50 w-[95%] max-w-6xl">
      {" "}
      <div className="container flex items-center justify-between h-16 px-6">
        <Link
          to="/"
          className="font-display text-xl font-bold text-gradient-gold tracking-wider">
          <img src={logo} alt="SF Technology" className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
            item.isLink ? (
              <Link
                key={item.label}
                to={item.href}
                className="text-xs font-display tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300">
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-display tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300">
                {item.label}
              </a>
            ),
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/cart"
            className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Button variant="hero" size="sm" asChild>
            <Link to="/contact">Холбоо барих ↗</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            to="/cart"
            className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen(!open)} className="text-foreground">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass-card border-t border-border/30">
            <div className="flex flex-col gap-4 p-6">
              {navItems.map((item) =>
                item.isLink ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-display tracking-widest text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-display tracking-widest text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </a>
                ),
              )}
              <Button variant="hero" size="sm" className="mt-2 w-full" asChild>
                <Link to="/contact">Холбоо барих ↗</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
