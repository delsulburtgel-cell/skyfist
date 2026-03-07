import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import contactBg from "@/assets/services-bg.jpg";
import { fadeUp } from "@/lib/animations";

const contactInfo = [
  {
    icon: MapPin,
    title: "Хаяг",
    detail: "Улаанбаатар хот, Баянгол дүүрэг",
  },
  {
    icon: Phone,
    title: "Утас",
    detail: "+976 7700-0000",
  },
  {
    icon: Mail,
    title: "И-мэйл",
    detail: "info@sftechnology.mn",
  },
  {
    icon: Clock,
    title: "Ажлын цаг",
    detail: "Даваа - Баасан: 09:00 - 18:00",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Мессеж амжилттай илгээгдлээ!",
      description: "Бид тантай удахгүй холбогдох болно.",
    });
    setForm({ name: "", email: "", phone: "", message: "" });
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
            src={contactBg}
            alt="Contact"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-center">
              <h1 className="font-display text-3xl md:text-5xl font-bold text-gradient-gold mb-4">
                Холбоо барих
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto px-6">
                Бидэнтэй холбогдож, технологийн шийдлүүдийн талаар мэдээлэл
                аваарай
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container px-6 py-20">
        <div className="line-gradient mb-16" />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-2xl font-bold text-foreground mb-8">
              Бидэнтэй холбогдоорой
            </motion.h2>

            <div className="space-y-6 mb-12">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors duration-300">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">
                      {info.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {info.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-xl h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-primary/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Газрын зураг</p>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <form
              onSubmit={handleSubmit}
              className="glass-card rounded-xl p-8 space-y-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Мессеж илгээх
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-display text-muted-foreground mb-2 block">
                    Нэр
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Таны нэр"
                    required
                    className="bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-display text-muted-foreground mb-2 block">
                    И-мэйл
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    required
                    className="bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-display text-muted-foreground mb-2 block">
                  Утас
                </label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+976 ..."
                  className="bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-display text-muted-foreground mb-2 block">
                  Мессеж
                </label>
                <Textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Та юу мэдэхийг хүсч байна вэ?"
                  rows={5}
                  required
                  className="bg-secondary/50 border-border/50 focus:border-primary resize-none"
                />
              </div>
              <Button variant="hero" size="lg" className="w-full" type="submit">
                <Send className="w-4 h-4 mr-2" />
                Илгээх
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
