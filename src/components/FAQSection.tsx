import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "SF TECHNOLOGY бусад компаниудаас юугаараа ялгаатай вэ?",
    a: "Бид 2016 оноос хойш технологийн цогц үйлчилгээг найдвартай, мэргэжлийн түвшинд хүргэж ирсэн туршлагатай. Б ангиллын тусгай зөвшөөрөлтэй, олон улсын стандартыг мөрддөг.",
  },
  {
    q: "Өндөр хурдны интернэт үйлчилгээний найдвартай байдлыг хэрхэн баталгаажуулдаг вэ?",
    a: "Шилэн кабелийн дэд бүтэц, 24/7 мониторинг, мэргэжлийн инженерүүдийн тасралтгүй дэмжлэгээр найдвартай байдлыг хангадаг.",
  },
  {
    q: "Камер, дохиоллын системийг суурилуулахдаа ямар олон улсын стандартыг мөрддөг вэ?",
    a: "Олон улсын ISO стандарт, Hikvision болон бусад тэргүүлэгч брэндүүдийн шаардлагыг бүрэн хангасан суурилуулалт хийдэг.",
  },
  {
    q: "Хэрэв байгууллага өргөжин, хэрэглээ нэмэгдвэл танай шийдлүүд өргөтгөх боломжтой юу?",
    a: "Тийм, бидний бүх шийдлүүд нь масштабтай, өргөтгөх боломжтой архитектуртай. Байгууллагын хэрэгцээ шаардлагад нийцүүлэн уян хатан тохируулна.",
  },
  {
    q: "Танай багийн туршлага, мэргэжлийн чадавхи ямар түвшинд байдаг вэ?",
    a: "Манай баг нь мэдээллийн технологи, сүлжээ, аюулгүй байдлын чиглэлээр олон жилийн туршлагатай мэргэжилтнүүдээс бүрддэг.",
  },
];

const FAQSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative" ref={ref}>
      <div className="container px-6 max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-xs font-display tracking-[0.3em] text-primary mb-12 uppercase text-center"
        >
          Нийтлэг асуулт, хариулт
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="glass-card rounded-xl px-6 border-border/30 data-[state=open]:border-primary/30 transition-colors duration-300"
              >
                <AccordionTrigger className="font-display text-sm font-medium text-foreground hover:text-primary transition-colors py-5 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
