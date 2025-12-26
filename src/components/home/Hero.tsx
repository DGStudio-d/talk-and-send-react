
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dir } = useLanguage();
  
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 py-16 md:py-24" dir={dir}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className={`order-2 md:order-1 ${dir === 'rtl' ? 'rtl' : ''}`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-academy-green">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700">
              {t('hero.description1')}
            </p>
            <p className="text-lg md:text-xl mb-8 text-gray-700">
              {t('hero.description2')}
            </p>
            <div className={`space-x-4 ${dir === 'rtl' ? 'space-x-reverse' : ''}`}>
              <Button 
                className="bg-academy-green hover:bg-opacity-90 px-8 py-6 text-lg"
                onClick={() => navigate('/register')}
              >
                {t('button.register')}
              </Button>
              <Button 
                variant="outline" 
                className="border-academy-green text-academy-green hover:bg-academy-green hover:text-white px-8 py-6 text-lg"
                onClick={() => navigate('/professors')}
              >
                {t('button.meetProfessors')}
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="/lovable-uploads/8f1fccaa-5cce-4888-a54d-fe66266e441a.png" 
              alt="Language Course" 
              className="rounded-lg shadow-xl w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
