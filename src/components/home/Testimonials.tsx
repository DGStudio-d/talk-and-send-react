import { useLanguage } from "@/contexts/LanguageContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTestimonials } from "@/hooks/useTestimonials";
import { MessageCircle } from "lucide-react";

const Testimonials = () => {
  const { t, dir } = useLanguage();
  const { data: testimonials, loading, error, refetch } = useTestimonials();

  if (loading) {
    return (
      <div className="bg-academy-green py-16" dir={dir}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white rtl">
            {t("testimonials.title")}
          </h2>

          <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-lg">
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  <div className="border-t pt-4">
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-academy-green py-16" dir={dir}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white rtl">
            {t("testimonials.title")}
          </h2>

          <div className="w-full max-w-4xl mx-auto">
            <Alert className="bg-white/10 border-white/20 text-white">
              <MessageCircle className="h-4 w-4" />
              <AlertDescription>
                {t("error.loadingTestimonials")}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="bg-academy-green py-16" dir={dir}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white rtl">
            {t("testimonials.title")}
          </h2>

          <div className="w-full max-w-4xl mx-auto text-center text-white">
            <p>{t("testimonials.noTestimonials")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-academy-green py-16" dir={dir}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white rtl">
          {t("testimonials.title")}
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
                      {testimonial.content || testimonial.text}
                    </p>
                    <div className="border-t pt-4 text-center">
                      <p className="font-bold rtl text-academy-green">
                        {testimonial.name}
                      </p>
                      {testimonial.role && (
                        <p className="text-sm text-gray-600 mt-1">
                          {testimonial.role}
                        </p>
                      )}
                      {testimonial.rating && (
                        <div className="flex justify-center mt-2">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < testimonial.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      )}
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
