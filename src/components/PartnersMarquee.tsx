import dell from "../assets/partners/dell.png";
import lenovo from "../assets/partners/lenovo.png";
import xerox from "../assets/partners/xerox-2008.svg";
import hik from "../assets/partners/hik.png";
import aj from "../assets/partners/aj.png";
import sam from "../assets/partners/sam.png";

const partners = [
  { name: "DELL", image: dell },
  { name: "LENOVO", image: lenovo },
  { name: "XEROX", image: xerox },
  { name: "HIKVISION", image: hik },
  { name: "AJ", image: aj },
  { name: "SAM", image: sam },
];

const PartnersMarquee = () => {
  return (
    <section className="py-10 ">
      <p className="text-center text-xs font-display tracking-[0.3em] text-primary mb-8 uppercase">
        Хамтын ажиллагаа
      </p>

      {/* CENTER CONTAINER */}
      <div className="relative mx-auto overflow-hidden max-w-sm md:max-w-xl lg:max-w-2xl">
        {/* LEFT FADE */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent z-10" />

        {/* RIGHT FADE */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="marquee-track flex items-center">
          {[...partners, ...partners, ...partners].map((partner, i) => (
            <img
              key={i}
              src={partner.image}
              alt={partner.name}
              className="flex-shrink-0 mx-10 w-28 md:w-40 object-contain select-none"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
