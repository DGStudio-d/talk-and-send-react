import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Users,
  BookOpen,
  Globe,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Clock,
  Award,
  ChevronLeft,
  CalendarDays,
  Video,
  MessageSquare,
  CheckCircle,
  Play,
} from "lucide-react";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { usePublicProfessor } from "@/services";
import { useLocaleQuery } from "@/hooks/useLocaleQuery";

const ProfessorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { linkTo } = useLocaleQuery();
  const { t, dir } = useLanguage();
  const { t: adminT } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("about");

  const professorId = Number(id);
  const {
    data: teacher,
    isLoading,
    error,
  } = usePublicProfessor(Number.isFinite(professorId) ? professorId : 0);

  if (isLoading) {
    return (
      <div>
        <Header variant="solid" />
        <div className="container mx-auto px-4 py-12 pt-28" dir={dir}>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">{t("professors.loading")}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div>
        <Header variant="solid" />
        <div className="container mx-auto px-4 py-12 pt-28" dir={dir}>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {t("professors.notFound")}
            </h1>
            <p className="text-muted-foreground mb-6">
              {t("professors.notFoundMessage")}
            </p>
            <Button onClick={() => navigate(linkTo("/professors"))}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t("professors.backToList")}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="font-semibold">{rating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">
          ({Math.floor(Math.random() * 100) + 50} {t("professors.reviews")})
        </span>
      </div>
    );
  };

  const availableSlots = [
    { day: "Monday", time: "10:00 AM - 12:00 PM" },
    { day: "Wednesday", time: "2:00 PM - 4:00 PM" },
    { day: "Friday", time: "3:00 PM - 5:00 PM" },
    { day: "Saturday", time: "10:00 AM - 2:00 PM" },
  ];

  const courses = [
    {
      id: 1,
      title: "Beginner Spanish",
      level: "A1",
      duration: "12 weeks",
      price: "$299",
      students: 45,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Business Spanish",
      level: "B2",
      duration: "8 weeks",
      price: "$399",
      students: 32,
      rating: 4.9,
    },
    {
      id: 3,
      title: "Conversation Practice",
      level: "B1",
      duration: "6 weeks",
      price: "$199",
      students: 28,
      rating: 4.7,
    },
  ];

  const reviews = [
    {
      id: 1,
      student: "Sarah Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment: "Excellent teacher! Very patient and explains concepts clearly.",
      avatar: "/avatars/sarah.jpg",
    },
    {
      id: 2,
      student: "Michael Chen",
      rating: 4,
      date: "1 month ago",
      comment:
        "Great experience. The lessons are well-structured and engaging.",
      avatar: "/avatars/michael.jpg",
    },
    {
      id: 3,
      student: "Emma Davis",
      rating: 5,
      date: "2 months ago",
      comment: "Highly recommend! My Spanish has improved significantly.",
      avatar: "/avatars/emma.jpg",
    },
  ];

  return (
    <div>
      <Header variant="solid" />
      <div className="container mx-auto px-4 py-12 pt-28" dir={dir}>
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/professors")}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t("professors.backToList")}
        </Button>

        {/* Teacher Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={teacher.avatar} />
                  <AvatarFallback className="text-2xl font-semibold">
                    {teacher.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{teacher.name}</h1>
                  <p className="text-xl text-muted-foreground mb-2">
                    {teacher.specialization}
                  </p>
                  {renderRating(teacher.rating)}
                </div>
              </div>

              {/* Stats and Info */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{teacher.studentsCount}</p>
                      <p className="text-sm text-muted-foreground">Students</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{teacher.coursesCount}</p>
                      <p className="text-sm text-muted-foreground">Courses</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">5+ years</p>
                      <p className="text-sm text-muted-foreground">
                        Experience
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Madrid, Spain</p>
                      <p className="text-sm text-muted-foreground">Location</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Spanish, English</p>
                      <p className="text-sm text-muted-foreground">Languages</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Certified</p>
                      <p className="text-sm text-muted-foreground">DELE C2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                {t("professors.languages")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {teacher.languages.map((lang, index) => (
                  <Badge key={index} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">
              {t("professors.tabs.about")}
            </TabsTrigger>
            <TabsTrigger value="courses">
              {t("professors.tabs.courses")}
            </TabsTrigger>
            <TabsTrigger value="schedule">
              {t("professors.tabs.schedule")}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              {t("professors.tabs.reviews")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("professors.about.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Hello! I'm {teacher.name}, a passionate Spanish language
                  instructor with over 5 years of experience teaching students
                  from around the world. I specialize in
                  {teacher.specialization.toLowerCase()} and love helping my
                  students achieve their language learning goals through
                  interactive and engaging lessons.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  My teaching approach focuses on practical communication
                  skills, cultural understanding, and building confidence in
                  real-world situations. Whether you're a complete beginner or
                  looking to refine your skills, I'll create a personalized
                  learning plan just for you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("professors.about.teachingStyle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Interactive, conversation-based learning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Personalized lesson plans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Cultural immersion activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Regular progress assessments</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <Badge variant="outline" className="mt-1">
                          {course.level}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {course.price}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {course.duration}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {course.students} students
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {course.rating}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full">
                      {t("professors.enrollNow")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("professors.schedule.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{slot.day}</p>
                          <p className="text-sm text-muted-foreground">
                            {slot.time}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">
                        {t("professors.bookSlot")}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>
                          {review.student
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.student}</p>
                            <p className="text-sm text-muted-foreground">
                              {review.date}
                            </p>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1" size="lg">
                <Video className="h-5 w-5 mr-2" />
                {t("professors.bookTrial")}
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                <MessageSquare className="h-5 w-5 mr-2" />
                {t("professors.sendMessage")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ProfessorDetailPage;
