import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocaleQuery } from "@/hooks/useLocaleQuery";
import { useTranslation } from "@/hooks/useTranslation";
import {
  usePublicQuiz,
  usePublicQuizQuestions,
  useQuiz,
  useQuizQuestions,
} from "@/services";
import {
  useCompleteQuizAttempt,
  useCompletePublicQuizAttempt,
  useStartPublicQuizAttempt,
  useStartQuizAttempt,
  useSubmitAnswer,
  useSubmitPublicAnswer,
} from "@/services";
import type { QuizQuestion } from "@/types/api";

const QuizTakePage = () => {
  const { id } = useParams();
  const quizId = Number(id);

  const navigate = useNavigate();
  const { dir } = useLanguage();
  const { linkTo } = useLocaleQuery();
  const { t, getLocalized } = useTranslation();
  const { isAuthenticated } = useAuth();

  const [publicName, setPublicName] = useState("");
  const [publicEmail, setPublicEmail] = useState("");

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const {
    data: quizPublic,
    isLoading: quizPublicLoading,
    error: quizPublicError,
  } = usePublicQuiz(quizId);

  const {
    data: quizAuth,
    isLoading: quizAuthLoading,
    error: quizAuthError,
  } = useQuiz(quizId);

  const quiz = isAuthenticated ? quizAuth : quizPublic;
  const quizLoading = isAuthenticated ? quizAuthLoading : quizPublicLoading;
  const quizError = isAuthenticated ? quizAuthError : quizPublicError;

  const {
    data: questionsPublic = [],
    isLoading: questionsPublicLoading,
    error: questionsPublicError,
  } = usePublicQuizQuestions(quizId);

  const {
    data: questionsAuth = [],
    isLoading: questionsAuthLoading,
    error: questionsAuthError,
  } = useQuizQuestions(quizId);

  const questions = isAuthenticated ? questionsAuth : questionsPublic;
  const questionsLoading = isAuthenticated
    ? questionsAuthLoading
    : questionsPublicLoading;
  const questionsError = isAuthenticated
    ? questionsAuthError
    : questionsPublicError;

  const startAuthAttempt = useStartQuizAttempt();
  const startPublicAttempt = useStartPublicQuizAttempt();

  const submitAuthAnswer = useSubmitAnswer();
  const submitPublicAnswer = useSubmitPublicAnswer();

  const completeAuthAttempt = useCompleteQuizAttempt();
  const completePublicAttempt = useCompletePublicQuizAttempt();

  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [publicAttemptId, setPublicAttemptId] = useState<string | null>(null);

  const currentQuestion: QuizQuestion | undefined = useMemo(
    () => questions[currentIndex],
    [questions, currentIndex]
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!quizId) return;
    if (started) return;

    startAuthAttempt.mutate(
      { quizId },
      {
        onSuccess: (attempt) => {
          setAttemptId(attempt.id);
          setStarted(true);
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, quizId]);

  const canStartPublic =
    publicName.trim().length > 1 &&
    publicEmail.trim().length > 3 &&
    publicEmail.includes("@");

  const handleStartPublic = () => {
    if (!canStartPublic) return;

    startPublicAttempt.mutate(
      {
        quizId,
        data: { user_name: publicName.trim(), user_email: publicEmail.trim() },
      },
      {
        onSuccess: (attempt) => {
          setPublicAttemptId((attempt as any).public_attempt_id ?? null);
          setStarted(true);
        },
      }
    );
  };

  const handleSubmitCurrent = async () => {
    if (!currentQuestion) return;
    const answer = answers[currentQuestion.id];
    if (!answer) return;

    if (isAuthenticated) {
      if (!attemptId) return;
      submitAuthAnswer.mutate({
        attemptId,
        questionId: currentQuestion.id,
        answer,
      });
      return;
    }

    if (!publicAttemptId) return;
    submitPublicAnswer.mutate({
      publicAttemptId,
      questionId: currentQuestion.id,
      answer,
    });
  };

  const handleNext = async () => {
    await handleSubmitCurrent();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((v) => v + 1);
      return;
    }

    // Last question: complete
    if (isAuthenticated) {
      if (!attemptId) return;
      completeAuthAttempt.mutate(attemptId, {
        onSuccess: () => {
          navigate(linkTo(`/quiz/results/${attemptId}`));
        },
      });
      return;
    }

    if (!publicAttemptId) return;
    completePublicAttempt.mutate(publicAttemptId, {
      onSuccess: () => {
        navigate(linkTo(`/quiz/public-results/${publicAttemptId}`));
      },
    });
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((v) => v - 1);
  };

  const disabled =
    submitAuthAnswer.isPending ||
    submitPublicAnswer.isPending ||
    completeAuthAttempt.isPending ||
    completePublicAttempt.isPending;

  return (
    <div>
      <Header variant="solid" />

      <div className="container mx-auto px-4 py-12 pt-28" dir={dir}>
        {quizLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ) : quizError || !quiz ? (
          <Card>
            <CardContent className="p-6 text-red-700">
              {t("error.loading")}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{getLocalized(quiz.title)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quiz.description && (
                  <p className="text-muted-foreground">
                    {getLocalized(quiz.description)}
                  </p>
                )}
              </CardContent>
            </Card>

            {!isAuthenticated && !started && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("quizTake.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("contact.name")}</Label>
                    <Input
                      id="name"
                      value={publicName}
                      onChange={(e) => setPublicName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("contact.email")}</Label>
                    <Input
                      id="email"
                      value={publicEmail}
                      onChange={(e) => setPublicEmail(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={handleStartPublic}
                    disabled={!canStartPublic || startPublicAttempt.isPending}
                    className="w-full"
                  >
                    {t("quizTake.startQuiz")}
                  </Button>
                </CardContent>
              </Card>
            )}

            {(isAuthenticated || started) && (
              <>
                {questionsLoading ? (
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-5 w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ) : questionsError ? (
                  <Card>
                    <CardContent className="p-6 text-red-700">
                      {t("error.loading")}
                    </CardContent>
                  </Card>
                ) : questions.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-muted-foreground">
                      {t("quizTake.noQuestions")}
                    </CardContent>
                  </Card>
                ) : !currentQuestion ? null : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {t("quizTake.question")} {currentIndex + 1} /{" "}
                        {questions.length}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-lg font-medium">
                        {getLocalized(currentQuestion.question_text)}
                      </div>

                      {currentQuestion.type !== "multiple_choice" ? (
                        <div className="text-sm text-muted-foreground">
                          {t("quizTake.unsupportedQuestion")}
                        </div>
                      ) : (
                        <RadioGroup
                          value={answers[currentQuestion.id] ?? ""}
                          onValueChange={(value) =>
                            setAnswers((prev) => ({
                              ...prev,
                              [currentQuestion.id]: value,
                            }))
                          }
                        >
                          {["A", "B", "C", "D"].map((opt) => {
                            const key =
                              opt === "A"
                                ? currentQuestion.option_a
                                : opt === "B"
                                ? currentQuestion.option_b
                                : opt === "C"
                                ? currentQuestion.option_c
                                : currentQuestion.option_d;

                            if (!key) return null;

                            const id = `q-${currentQuestion.id}-${opt}`;
                            return (
                              <div
                                key={opt}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem id={id} value={opt} />
                                <Label htmlFor={id}>{getLocalized(key)}</Label>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <Button
                          variant="outline"
                          onClick={handlePrev}
                          disabled={currentIndex === 0 || disabled}
                        >
                          {t("button.previous")}
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            onClick={handleNext}
                            disabled={
                              disabled ||
                              (currentQuestion.type === "multiple_choice" &&
                                !answers[currentQuestion.id])
                            }
                          >
                            {currentIndex === questions.length - 1
                              ? t("button.submit")
                              : t("button.next")}
                          </Button>

                          <Button
                            variant="secondary"
                            onClick={() => navigate(linkTo("/quizzes"))}
                            disabled={disabled}
                          >
                            {t("button.back")}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default QuizTakePage;
