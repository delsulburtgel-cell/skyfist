import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import securityImg from "@/assets/security-camera.jpg";
import alarmImg from "@/assets/alarm-system.jpg";
import { fadeUp } from "@/lib/animations";

const SecurityServices = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    {/* Hero */}
    <section className="relative pt-24">
      <div className="h-72 md:h-96 overflow-hidden relative">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={securityImg}
          alt="Security"
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
            Аюулгүй байдлын
            <br />
            цогц үйлчилгээ
          </motion.h1>
        </div>
      </div>
    </section>

    <section className="container px-6 py-20">
      <div className="line-gradient mb-16" />

      {/* Camera section with image */}
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
            <img src={securityImg} alt="CCTV Camera" className="w-full aspect-square object-cover" />
          </motion.div>
        </div>
        <div className="md:w-1/2">
          <h2 className="font-display text-xl font-bold text-foreground mb-6">
            ХЯНАЛТЫН КАМЕРЫН ЦОГЦ ҮЙЛЧИЛГЭЭ
          </h2>
          <p className="text-sm text-primary/70 mb-3 font-display">Худалдаа, дагалдах хэрэгсэл:</p>
          <ul className="space-y-2 mb-6">
            {["IP Камер", "Аналог камер", "PTZ камер", "Дулаан мэдрэгч камер", "Нууц камер", "DVR/NVR төхөөрөмж"].map((item, i) => (
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
                {item}
              </motion.li>
            ))}
          </ul>
          <p className="text-sm text-primary/70 mb-3 font-display">Үйлчилгээ:</p>
          <ul className="space-y-2">
            {["Системийн төлөвлөлт, зөвлөгөө", "Суурилуулалт, угсралт", "Засвар үйлчилгээ", "Камерын тохиргоо, хяналт", "Түрээсийн үйлчилгээ"].map((item, i) => (
              <motion.li
                key={i}
                custom={i + 6}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Alarm section with image */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        custom={0}
        className="flex flex-col md:flex-row-reverse gap-8 items-center"
      >
        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl overflow-hidden glow-gold"
          >
            <img src={alarmImg} alt="Alarm system" className="w-full aspect-square object-cover" />
          </motion.div>
        </div>
        <div className="md:w-1/2">
          <h2 className="font-display text-xl font-bold text-foreground mb-6">
            ДОХИОЛОЛ ХОЛБООНЫ ЦОГЦ ҮЙЛЧИЛГЭЭ
          </h2>
          <ul className="space-y-3">
            {[
              "Аюулгүй байдлын дохиоллын үйлчилгээ",
              "Техник хангамжийн үйлчилгээ",
              "Хяналтын үйлчилгээ",
              "Захиалгат шийдэл",
              "Сургалт, зөвлөх үйлчилгээ",
              "Тусгай зориулалтын дохиоллын систем",
            ].map((item, i) => (
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
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
    <Footer />
  </div>
);

export default SecurityServices;
