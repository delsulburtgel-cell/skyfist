import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import fiberImg from "@/assets/fiber-optic.jpg";
import fiberInstallImg from "@/assets/fiber-install.jpg";
import serverRackImg from "@/assets/server-rack.jpg";
import { fadeUp } from "@/lib/animations";

const services = [
  {
    title: "ӨНДӨР ХУРДНЫ ШИЛЭН КАБЕЛИЙН ИНТЕРНЭТ ҮЙЛЧИЛГЭЭ",
    desc: "FTTB - FIBER TO THE BUILDING нь шилэн кабелийг барилга байшин руу оруулах гэсэн утгатай. Байранд орсон шилэн кабелийн үзүүр дээр менеж свич тавьж түүнээс кабель татаж хэрэглэгчдэд интернэтийг хүргэдэг.",
    image: fiberImg,
  },
  {
    title: "ШИЛЭН КАБЕЛИЙН ШӨРМӨС ТҮРЭЭС БОЛОН VPN ҮЙЛЧИЛГЭЭ",
    desc: "Шилэн кабелийн шөрмөс гаргаж онлайн холболт үүсгэнэ. Салбар нэгжүүд VPN-ээр 24 цагийн турш онлайнаар холбогдож, мэдээллийг цаг алдалгүй хурдан шуурхай дамжуулах боломжтой.",
    image: fiberInstallImg,
  },
  {
    title: "ШИЛЭН КАБЕЛИЙН АШИГЛАЛТ, ЗАСВАР ҮЙЛЧИЛГЭЭ",
    desc: "Шилэн кабелийн сүлжээний дэд бүтцийн ашиглалт, засвар үйлчилгээг мэргэжлийн түвшинд хийж гүйцэтгэнэ. 24/7 мониторинг, мэргэжлийн инженерүүдийн тасралтгүй дэмжлэг.",
    image: serverRackImg,
  },
];

const FiberInternet = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    {/* Hero */}
    <section className="relative pt-24">
      <div className="h-72 md:h-96 overflow-hidden relative">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={fiberImg}
          alt="Fiber optic"
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
            Шилэн кабелийн сүлжээ
            <br />
            интернэт үйлчилгээ
          </motion.h1>
        </div>
      </div>
    </section>

    {/* Services */}
    <section className="container px-6 py-20">
      <div className="line-gradient mb-16" />
      <div className="space-y-20">
        {services.map((s, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
          >
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-xl overflow-hidden glow-gold"
              >
                <img src={s.image} alt={s.title} className="w-full aspect-[4/3] object-cover" />
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-4">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Stats */}
    <section className="container px-6 pb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { num: "500+", label: "Хэрэглэгч" },
          { num: "99.9%", label: "Найдвартай байдал" },
          { num: "24/7", label: "Дэмжлэг" },
          { num: "1Gbps", label: "Хамгийн өндөр хурд" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-6 text-center"
          >
            <p className="font-display text-2xl md:text-3xl font-bold text-primary">{stat.num}</p>
            <p className="text-xs text-muted-foreground mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default FiberInternet;
