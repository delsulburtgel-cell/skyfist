import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Handshake, Target, Eye, Heart, Cpu } from "lucide-react";

const cards = [
  {
    icon: Cpu,
    title: "Мэдээлэл технологийн компани",
    desc: "Мэргэжлийн, туршлагатай хамт олон",
  },
  {
    icon: Building2,
    title: "Технологийн цогц үйлчилгээ",
    desc: "Байгууллагын тань бүх хэрэгцээг нэг дор",
  },
  {
    icon: Handshake,
    title: "Хамтын ажиллагааг эрхэмлэгч",
    desc: "Тогтвортой харилцаа, найдвартай түншлэл",
  },
  {
    icon: Target,
    title: "Эрхэм зорилго",
    desc: "Чанар аюулгүй байдлыг эрхэмлэн, монгол улсын хөгжлийг хурдасгах",
  },
  {
    icon: Heart,
    title: "Үнэт зүйлс",
    desc: "Харилцагч · Хамтын хөгжил · Хариуцлага",
  },
  {
    icon: Eye,
    title: "Алсын хараа",
    desc: "Манлайлагч · Хөгжүүлэгч · Эрхэмлэгч хамт олон болох",
  },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 relative" ref={ref}>
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16">
          <p className="text-xs font-display tracking-[0.3em] text-primary mb-4 uppercase">
            Яагаад бид гэж
          </p>
          <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            Манай компани нь{" "}
            <span className="text-primary font-semibold">2016 онд</span> үүсгэн
            байгуулагдсан ба харилцаа холбооны зохицуулах хорооны{" "}
            <span className="text-primary font-semibold">"Б" ангиллын</span>{" "}
            тусгай зөвшөөрөлтэйгээр үйл ажиллагаа явуулдаг.
            <br />
            Бид шинэ цагийн технологийн дэвшлийг ашиглан найдвартай,
            хариуцлагатай үйлчилгээг хүргэж, цаашдын ашиглалтыг бүрэн хариуцаж,
            хэрэглэгчдийн талархлыг хүлээсэн технологийн цогц үйлчилгээ үзүүлэгч
            компани юм.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 group hover:border-primary/30 transition-all duration-500 hover:glow-gold">
              <card.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-display font-semibold text-foreground mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
