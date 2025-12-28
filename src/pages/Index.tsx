
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import LanguagesList from "@/components/home/LanguagesList";
import QuizSection from "@/components/home/QuizSection";
import Testimonials from "@/components/home/Testimonials";
import NavBar from "@/components/common/NavBar";
import Footer from "@/components/common/Footer";
import LanguageDebug from "@/components/common/LanguageDebug";

const Index = () => {
  return (
    <div>
      <NavBar />
      {/* Debug component - only shows in development mode */}
      <LanguageDebug />
      <Hero />
      <Features />
      <LanguagesList />
      <QuizSection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
