
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-12" dir={dir}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rtl">
            <Logo />
            <p className="mt-4 text-gray-600">
              {t('footer.description')}
            </p>
          </div>
          
          <div className="rtl">
            <h3 className="text-lg font-bold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-academy-green">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/languages" className="text-gray-600 hover:text-academy-green">
                  {t('nav.languages')}
                </Link>
              </li>
              <li>
                <Link to="/professors" className="text-gray-600 hover:text-academy-green">
                  {t('nav.professors')}
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-academy-green">
                  {t('nav.register')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="rtl">
            <h3 className="text-lg font-bold mb-4">{t('footer.contactUs')}</h3>
            <p className="text-gray-600 mb-4">
              {t('contact.email')}: info@learnacademy.com
            </p>
            <p className="text-gray-600 mb-4">
              {t('contact.phone')}: +212 625-815692
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-academy-green">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-academy-green">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-academy-green">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-academy-green">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center rtl">
          <p className="text-gray-600">
            {t('footer.copyright').replace('{year}', currentYear.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
