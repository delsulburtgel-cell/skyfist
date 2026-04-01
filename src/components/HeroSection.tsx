import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 z-[1] bg-background/70" />
      {/* Dot pattern */}
      <div className="absolute inset-0 z-[2] dot-pattern opacity-30" />

      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] z-[2]" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-primary/80 text-sm font-medium tracking-[0.3em] uppercase mb-6">
          SF Technology
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-7xl font-display hero-heading leading-tight mb-8">
          <span className="text-gradient">Бид технологийн цогц</span>
          <br />
          <span className="text-foreground">үйлчилгээг үзүүлнэ</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
          Шинэ цагийн технологийн дэвшлийг ашиглан найдвартай, хариуцлагатай
          үйлчилгээг хүргэнэ
        </motion.p>

        <motion.a
          href="#about"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="inline-flex items-center gap-3 glass glow-border px-8 py-4 rounded-2xl text-foreground font-medium hover:bg-primary/10 transition-all duration-300">
          Дэлгэрэнгүй
          <ArrowDown size={16} className="text-primary animate-bounce" />
        </motion.a>

        {/* Status indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-12 flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-glow-pulse" />
          <span className="text-xs text-muted-foreground">
            Үйл ажиллагаа идэвхтэй
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
