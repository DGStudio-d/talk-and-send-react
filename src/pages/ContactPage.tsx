
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import NavBar from "@/components/common/NavBar";
import Footer from "@/components/common/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const navigate = useNavigate();
  const { dir } = useLanguage();
  const { t } = useTranslation();

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-12" dir={dir}>
        <h1 className="text-3xl font-bold text-center mb-6">
          {t('contact.title')}
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {t('contact.description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-academy-green">
              {t('contact.methods')}
            </h2>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="flex items-start space-x-4 space-x-reverse p-4">
                  <div className="bg-academy-green/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-academy-green" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{t('contact.phone')}</h3>
                    <p className="text-gray-600">+212 625-815692</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-start space-x-4 space-x-reverse p-4">
                  <div className="bg-academy-green/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-academy-green" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{t('contact.email')}</h3>
                    <p className="text-gray-600">info@learnacademy.com</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-start space-x-4 space-x-reverse p-4">
                  <div className="bg-academy-green/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-academy-green" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{t('contact.address')}</h3>
                    <p className="text-gray-600">
                      {t('contact.addressValue')}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-start space-x-4 space-x-reverse p-4">
                  <div className="bg-academy-green/10 p-3 rounded-full">
                    <MessageSquare className="h-6 w-6 text-academy-green" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{t('contact.whatsapp')}</h3>
                    <p className="text-gray-600 mb-3">
                      {t('contact.whatsappDesc')}
                    </p>
                    <Button
                      onClick={() => navigate('/whatsapp')}
                      className="bg-academy-green hover:bg-opacity-90"
                    >
                      {t('button.whatsapp')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
            {/* Embed a Google Maps iframe or use a map component */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.72691575654!2d-6.8782621!3d33.97159745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b871f50c5c1%3A0x7ac946ed7408076b!2sRabat!5e0!3m2!1sen!2sma!4v1715109473090!5m2!1sen!2sma" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ContactPage;
