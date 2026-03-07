import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin } from "lucide-react";

const projects = [
  {
    title: "ОРОН НУТГИЙН КАМЕРЖУУЛАЛТ",
    desc: "Архангай аймаг, Хэнтий аймаг болон Өмнөдэлгэр, Батноров сумдуудын төвийн камержуулалтын ажил гүйцэтгэв.",
  },
  {
    title: "ӨВӨРХАНГАЙ АЙМАГ",
    desc: "Нийтийн эзэмшлийн гудамж, зам, талбайн хяналтын камерын арчлалт, хамгаалалт, засвар үйлчилгээг хариуцан ажиллав.",
  },
  {
    title: "ТАВАН ТОЛГОЙ ТҮЛШ ХХК",
    desc: 'Төвийн болон Зүүн бүсийн үйлдвэрт "Нэвтрэх систем" суурилуулж, богино долгионы гар болон суурин станц нийлүүлэв.',
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 relative" ref={ref}>
      <div className="container px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-xs font-display tracking-[0.3em] text-primary mb-12 uppercase text-center"
        >
          Хамтын ажиллагаа
        </motion.p>

        <div className="line-gradient mb-12" />

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="glass-card rounded-xl p-8 group hover:border-primary/30 transition-all duration-500"
            >
              <MapPin className="w-5 h-5 text-primary mb-4" />
              <h3 className="font-display text-sm font-semibold tracking-wider text-foreground mb-3">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
