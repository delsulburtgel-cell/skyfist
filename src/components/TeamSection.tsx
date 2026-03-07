import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import teamBg from "@/assets/team-bg.jpg";
const team = [
  { name: "Далантай ОДОНТУЯА", role: "Үйл ажиллагаа эрхэлсэн захирал" },
  { name: "Батсайхан ЦЭНГЭЛ", role: "Захиргааны албаны дарга" },
  { name: "Бадрал АНАНД", role: "Бизнес хөгжлийн албаны дарга" },
  { name: "Оюуттөр ЦОЛМОН", role: "Техникийн албаны дарга" },
  { name: "Ганболд ДЭЛГЭРМАА", role: "Маркетинг, борлуулалтын албаны дарга" },
  { name: "Эрдэнээ ГАНЧИМЭГ", role: "Сургалтын албаны дарга" },
];

const TeamSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="team" className="py-24 px-4 relative" ref={ref}>
      {/* Background */}
      <div
        className="absolute inset-0 z-0 opacity-8"
        style={{
          backgroundImage: `url(${teamBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-[1] bg-background/85" />
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-center mb-12">
          <p className="text-xs font-display tracking-[0.3em] text-primary mb-4 uppercase">
            Манай хамт олон
          </p>
          <p className="text-sm text-muted-foreground">
            Манай мэргэжлийн чадварлаг багтай танилцана уу
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card rounded-xl z-[2] overflow-hidden group">
              <div className="aspect-[3/4] bg-gradient-to-b from-secondary/50 to-secondary/20 flex items-end justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="w-16 h-16 rounded-full bg-primary/10 absolute top-1/3 left-1/2 -translate-x-1/2 blur-xl group-hover:bg-primary/20 transition-all duration-700" />
                <span className="text-6xl font-display font-bold text-muted-foreground/10 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {member.name.charAt(0)}
                </span>
              </div>
              <div className="p-4 relative z-10 -mt-12">
                <h3 className="font-display text-sm font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
