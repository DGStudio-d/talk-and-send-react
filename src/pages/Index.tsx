import React from "react";
import { Header } from "@/components/common/Header";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import LanguagesList from "@/components/home/LanguagesList";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/common/Footer";
import LanguageDebug from "@/components/common/LanguageDebug";
import { useLocaleQuery } from "@/hooks/useLocaleQuery";

const Index = () => {
  useLocaleQuery();

  return (
    <div>
      <Header variant="transparent" />
      {/* Debug component - only shows in development mode */}
      <LanguageDebug />
      <Hero />
      <Features />
      <LanguagesList />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
