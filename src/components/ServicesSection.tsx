import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Wifi, Shield, Monitor, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import fiberImg from "@/assets/fiber-optic.jpg";
import trainingImg from "@/assets/training.jpg";
import techSupplyImg from "@/assets/tech-supply.jpg";
import securityImg from "@/assets/security-camera.jpg";

const serviceCards = [
  {
    title: "Шилэн кабелийн сүлжээ ба интернэт үйлчилгээ",
    icon: Wifi,
    image: fiberImg,
    link: "/fiber-internet",
  },
  {
    title: "Байгууллагын сургалт, аудит ба зөвлөх үйлчилгээ",
    icon: GraduationCap,
    image: trainingImg,
    link: "/training-consulting",
  },
  {
    title: "Технологи ба электрон бүтээгдэхүүний нийлүүлэлт",
    icon: Monitor,
    image: techSupplyImg,
    link: "/tech-supply",
  },
  {
    title: "Аюулгүй байдлын цогц үйлчилгээ",
    icon: Shield,
    image: securityImg,
    link: "/security-services",
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 relative" ref={ref}>
      <div className="container px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-xs font-display tracking-[0.3em] text-primary mb-12 uppercase text-center"
        >
          Бидний үйлчилгээ
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {serviceCards.map((card, i) => (
            <Link to={card.link} key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:border-primary/40 transition-all duration-500 hover:glow-gold h-full"
              >
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>
                <div className="p-5">
                  <card.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-display text-sm font-semibold text-foreground leading-snug">
                    {card.title}
                  </h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
