import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data, error } = await supabase
          .from("questions")
          .select("id, question, answer")
          .order("created_at", { ascending: true });

        if (error) throw error;
        setFaqs(data || []);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <section className="py-24 relative" ref={ref}>
      <div className="container px-6 max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-xs font-display tracking-[0.3em] text-primary mb-12 uppercase text-center">
          Нийтлэг асуулт, хариулт
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}>
          {loading ? (
            <p className="text-muted-foreground text-center">
              Уг үеийн асуулт ачаалж байна...
            </p>
          ) : faqs.length === 0 ? (
            <p className="text-muted-foreground text-center">
              Асуулт олдсонгүй
            </p>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.id}
                  value={`faq-${i}`}
                  className="glass-card rounded-xl px-6 border-border/30 data-[state=open]:border-primary/30 transition-colors duration-300">
                  <AccordionTrigger className="font-display text-sm font-medium text-foreground hover:text-primary transition-colors py-5 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
