import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import techSupplyImg from "@/assets/tech-supply.jpg";
import officeTechImg from "@/assets/office-tech.jpg";
import { fadeUp } from "@/lib/animations";

const categories = [
  {
    title: "Компьютер",
    items: ["Зөөврийн компьютер", "Суурин компьютер", "Дэлгэц / Monitor", "All in one"],
  },
  {
    title: "Принтер",
    items: ["Лазер принтер", "Шингэн хортой принтер", "Сканнер", "Хор", "Дагалдах хэрэгсэл"],
  },
  {
    title: "Оффисын төхөөрөмж",
    items: ["Хурлын төхөөрөмж", "Ухаалаг дэлгэц | Зурагт", "Проктер", "IP утас", "Цаас устгагч", "UPS"],
  },
  {
    title: "Сүлжээний төхөөрөмж",
    items: ["Wireless Networking", "Wired Networking", "Rack & Accessories", "Сүлжээний кабель", "Fiber optic"],
  },
  {
    title: "Аудио төхөөрөмж",
    items: ["Чанга яригч", "Микрофон", "Чихэвч", "Дуу хураагуур"],
  },
];

const TechSupply = () => (
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
          alt="Tech supply"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-display text-3xl md:text-5xl font-bold text-gradient-gold text-center px-6"
          >
            Технологи ба электрон бүтээгдэхүүний
            <br />
            нийлүүлэлт, худалдаа, үйлчилгээ
          </motion.h1>
        </div>
      </div>
    </section>

    <section className="container px-6 py-20">
      <div className="line-gradient mb-16" />

      {/* Image banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <img src={officeTechImg} alt="Office tech" className="w-full aspect-[21/9] object-cover rounded-xl" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-display text-xl font-bold text-foreground mb-8 text-center"
      >
        ТОНОГ ТӨХӨӨРӨМЖИЙН НИЙЛҮҮЛЭЛТ, ХУДАЛДАА
      </motion.h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-500 hover:glow-gold"
          >
            <h3 className="font-display text-sm font-bold text-primary mb-4">{cat.title}</h3>
            <ul className="space-y-2">
              {cat.items.map((item, j) => (
                <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default TechSupply;
