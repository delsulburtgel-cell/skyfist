import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PartnersMarquee from "@/components/PartnersMarquee";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ServicesSection from "@/components/ServicesSection";
import ProductsSection from "@/components/ProductsSection";
import TeamSection from "@/components/TeamSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <PartnersMarquee />
      <AboutSection />
      <ProjectsSection />
      <ServicesSection />
      <ProductsSection />
      <TeamSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
