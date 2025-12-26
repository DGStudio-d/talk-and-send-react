
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import LanguagesList from "@/components/home/LanguagesList";
import Testimonials from "@/components/home/Testimonials";
import NavBar from "@/components/common/NavBar";
import Footer from "@/components/common/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";

const Index = () => {
  return (
    <div>
      <NavBar />
      <Hero />
      <Features />
      <LanguagesList />
      <Testimonials />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
