import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { QPayCheckoutDialog } from "@/components/QPayCheckoutDialog";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const formatPrice = (price: number) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "₮";

  const handleCheckout = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Нэр, утасны дугаар болон хаягийг заавал бөглөнө үү!");
      return;
    }
    setCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    console.log("Order completed successfully!");
    // Here you could save the order to database
    clearCart();
    setCheckoutOpen(false);
    setCustomerInfo({ name: "", phone: "", email: "", address: "" });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-6 pt-28 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-6" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">
            Сагс хоосон байна
          </h1>
          <p className="text-muted-foreground mb-8">
            Бүтээгдэхүүн нэмж эхлээрэй
          </p>
          <Button variant="hero" asChild>
            <Link to="/#products">Дэлгүүр үзэх</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-6 pt-28 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 font-display">
          <ArrowLeft className="w-4 h-4" />
          Нүүр хуудас
        </Link>

        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Таны сагс
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-4 flex gap-4 items-center">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-semibold text-foreground truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.product.category}
                  </p>
                  <p className="font-display font-bold text-primary mt-1">
                    {item.product.priceFormatted}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-display font-semibold text-foreground w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="font-display font-bold text-foreground">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="glass-card rounded-xl p-6 h-fit sticky top-24">
            <h3 className="font-display font-semibold text-foreground mb-6">
              Захиалгын дүн
            </h3>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="text-foreground font-medium flex-shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="line-gradient mb-4" />
            <div className="flex justify-between mb-6">
              <span className="font-display font-semibold text-foreground">
                Нийт
              </span>
              <span className="font-display text-xl font-bold text-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Customer Information Form */}
            <div className="space-y-4 mb-6">
              <h4 className="font-display font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Хэрэглэгчийн мэдээлэл
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Нэр *
                  </label>
                  <Input
                    placeholder="Таны нэр"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Утасны дугаар *
                  </label>
                  <Input
                    placeholder="70000000"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        phone: e.target.value,
                      })
                    }
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    И-мэйл
                  </label>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        email: e.target.value,
                      })
                    }
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Хаяг *
                  </label>
                  <Textarea
                    placeholder="Хүргүүлэх хаяг"
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        address: e.target.value,
                      })
                    }
                    className="text-sm min-h-[60px]"
                  />
                </div>
              </div>
            </div>

            <Button
              variant="hero"
              size="lg"
              className="w-full mb-3"
              onClick={handleCheckout}>
              QPay-ээр төлөх
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="w-full text-muted-foreground">
              Сагс хоослох
            </Button>
          </div>
        </div>
      </div>

      {/* QPay Checkout Dialog */}
      <QPayCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cartTotal={totalPrice}
        items={items}
        onCheckoutSuccess={handleCheckoutSuccess}
        customerInfo={customerInfo}
      />

      <Footer />
    </div>
  );
};

export default Cart;
