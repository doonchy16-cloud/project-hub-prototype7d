import { useEffect, useMemo } from "react";
import { useLocalStorageState } from "@/hooks/use-local-storage-state";
import { getAdaptiveQuestions } from "@/lib/prototype-utils";
import type { Question } from "@/types/prototype";

export function useQuestionnaire(currentLocation: string) {
  const [questionnaireAnswers, setQuestionnaireAnswers] = useLocalStorageState<Record<string, string>>(
    "prototype7:questionnaireAnswers",
    {}
  );
  const [questionnaireStep, setQuestionnaireStep] = useLocalStorageState("prototype7:questionnaireStep", 0);

  const adaptiveQuestions = useMemo<Question[]>(
    () => getAdaptiveQuestions(currentLocation, questionnaireAnswers),
    [currentLocation, questionnaireAnswers]
  );

  useEffect(() => {
    setQuestionnaireStep((prev) => Math.min(prev, Math.max(adaptiveQuestions.length - 1, 0)));
  }, [adaptiveQuestions.length]);

  const currentQuestion = adaptiveQuestions[Math.min(questionnaireStep, adaptiveQuestions.length - 1)];
  const answeredCount = adaptiveQuestions.filter(
    (question) => String(questionnaireAnswers[question.id] || "").trim().length > 0
  ).length;
  const questionnaireComplete = answeredCount === adaptiveQuestions.length;
  const questionnaireProgressPercent =
    adaptiveQuestions.length === 0 ? 0 : Math.round((answeredCount / adaptiveQuestions.length) * 100);

  const groupedSummary = useMemo<Record<string, { id: string; label: string; value: string }[]>>(() => {
    const summary: Record<string, { id: string; label: string; value: string }[]> = {};
    adaptiveQuestions.forEach((question) => {
      if (!summary[question.category]) summary[question.category] = [];
      summary[question.category].push({
        id: question.id,
        label: question.label,
        value: questionnaireAnswers[question.id] || "Not answered yet",
      });
    });
    return summary;
  }, [adaptiveQuestions, questionnaireAnswers]);

  const updateAnswer = (questionId: string, value: string) => {
    setQuestionnaireAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      if (questionId === "household_type") {
        if (value === "Individual") next.household_size = "1";
        else if (value === "Couple") next.household_size = "2";
        else delete next.household_size;
      }
      return next;
    });
  };

  return {
    questionnaireAnswers,
    setQuestionnaireAnswers,
    questionnaireStep,
    setQuestionnaireStep,
    adaptiveQuestions,
    currentQuestion,
    answeredCount,
    questionnaireComplete,
    questionnaireProgressPercent,
    groupedSummary,
    updateAnswer,
  };
}
