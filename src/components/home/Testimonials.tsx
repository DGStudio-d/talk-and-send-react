
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/data/testimonials";

const Testimonials = () => {
  const { t } = useTranslation();
  const { dir } = useLanguage();

  return (
    <div className="bg-academy-green py-16" dir={dir}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white rtl">
          {t('testimonials.title')}
        </h2>
        
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/1">
                <Card className="bg-white shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-6 text-6xl text-academy-green">
                      ❝
                    </div>
                    <p className="text-lg mb-6 rtl text-gray-700">
                      {testimonial.text}
                    </p>
                    <div className="border-t pt-4 text-center">
                      <p className="font-bold rtl text-academy-green">
                        {testimonial.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>
  );
};

export default Testimonials;
