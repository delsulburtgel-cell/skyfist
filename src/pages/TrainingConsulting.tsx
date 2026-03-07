import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import trainingImg from "@/assets/training.jpg";
import presentationImg from "@/assets/presentation.jpg";
import { fadeUp } from "@/lib/animations";

const courses = [
  "МАБ анхан шатны мэдлэг",
  "ISO 27001 танилцуулга",
  "Удирдлагын сургалт",
  "Дотоод аудитор бэлтгэх",
  "SOC ажиллах зарчим",
  "КАБ практик сургалт",
  "Microsoft – Office 365 хэрэглэгчийн сургалт",
  "Smart Office + AI",
  "AI Bootcamp",
];

const TrainingConsulting = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    {/* Hero */}
    <section className="relative pt-24">
      <div className="h-72 md:h-96 overflow-hidden relative">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={trainingImg}
          alt="Training"
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
            Байгууллагын сургалт, аудит
            <br />
            зөвлөх үйлчилгээ
          </motion.h1>
        </div>
      </div>
    </section>

    <section className="container px-6 py-20">
      <div className="line-gradient mb-16" />

      {/* Training with image */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        custom={0}
        className="flex flex-col md:flex-row gap-8 items-center mb-20"
      >
        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl overflow-hidden glow-gold"
          >
            <img src={presentationImg} alt="Presentation" className="w-full aspect-[4/3] object-cover" />
          </motion.div>
        </div>
        <div className="md:w-1/2">
          <h2 className="font-display text-xl font-bold text-foreground mb-6">
            БАЙГУУЛЛАГА БОЛОН ХУВЬ ХҮНД ЗОРИУЛСАН СУРГАЛТ
          </h2>
          <p className="text-sm text-muted-foreground mb-6">Үндсэн сургалтын хөтөлбөр</p>
          <ul className="space-y-3">
            {courses.map((c, i) => (
              <motion.li
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                {c}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Training image gallery */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl overflow-hidden mb-20"
      >
        <img src={trainingImg} alt="Training session" className="w-full aspect-[21/9] object-cover rounded-xl" />
      </motion.div>

      {/* Audit + Consulting */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          {
            title: "АУДИТ, ЭРСДЭЛИЙН ҮНЭЛГЭЭ",
            desc: "Байгууллагын мэдээллийн аюулгүй байдлын аудит, эрсдэлийн үнэлгээ хийж, сайжруулалтын зөвлөмж боловсруулна.",
          },
          {
            title: "ЗӨВЛӨХ ҮЙЛЧИЛГЭЭ",
            desc: "Мэдээллийн технологийн стратеги, дэд бүтцийн оновчлол, системийн нэгтгэлийн зөвлөх үйлчилгээ.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="glass-card rounded-xl p-8 hover:border-primary/30 transition-all duration-500 hover:glow-gold"
          >
            <h2 className="font-display text-lg font-bold text-foreground mb-4">{item.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default TrainingConsulting;
