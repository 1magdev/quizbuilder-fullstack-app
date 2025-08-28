"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFont,
  faCheckCircle,
  faTimesCircle,
  faCheckSquare,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";
import { quizApi, Quiz, Question } from "@/lib/api";

export default function QuizViewPage() {
  const router = useRouter();
  const params = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const id = Number(params.id);
        if (isNaN(id)) {
          throw new Error("Invalid quiz ID");
        }
        const data = await quizApi.getById(id);
        setQuiz(data);
        setError(null);
      } catch (err) {
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchQuiz();
    }
  }, [params.id]);

  const renderQuestionContent = (question: Question, index: number) => {
    switch (question.type) {
      case "short-text":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faFont} className="w-4 h-4" />
              <span>Short Text Response</span>
            </div>
            {question.placeholder && (
              <div className="bg-gray-50 border rounded-md p-3">
                <p className="text-sm text-gray-600">
                  <strong>Placeholder:</strong> {question.placeholder}
                </p>
              </div>
            )}
            <div className="bg-gray-100 border rounded-md p-3">
              <p className="text-sm text-gray-700">
                <FontAwesomeIcon icon={faFont} className="w-4 h-4 mr-2" />
                This is an open-ended text question
              </p>
            </div>
          </div>
        );

      case "boolean":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faCheckSquare} className="w-4 h-4" />
              <span>True/False Question</span>
            </div>
            <div className="space-y-2">
              <div
                className={`border rounded-md p-3 flex items-center gap-3 ${
                  question.answer === true
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50"
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    question.answer === true ? faCheckCircle : faTimesCircle
                  }
                  className={`w-5 h-5 ${
                    question.answer === true
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={
                    question.answer === true
                      ? "font-medium text-green-700"
                      : "text-gray-600"
                  }
                >
                  True
                </span>
                {question.answer === true && (
                  <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Correct Answer
                  </span>
                )}
              </div>
              <div
                className={`border rounded-md p-3 flex items-center gap-3 ${
                  question.answer === false
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50"
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    question.answer === false ? faCheckCircle : faTimesCircle
                  }
                  className={`w-5 h-5 ${
                    question.answer === false
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={
                    question.answer === false
                      ? "font-medium text-green-700"
                      : "text-gray-600"
                  }
                >
                  False
                </span>
                {question.answer === false && (
                  <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Correct Answer
                  </span>
                )}
              </div>
            </div>
          </div>
        );

      case "multiple-choice":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faListUl} className="w-4 h-4" />
              <span>Multiple Choice</span>
            </div>
            <div className="space-y-2">
              {question.options?.map((option) => {
                const isCorrect = question.answer === option.id;
                return (
                  <div
                    key={option.id}
                    className={`border rounded-md p-3 flex items-center gap-3 ${
                      isCorrect ? "bg-green-50 border-green-200" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isCorrect
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isCorrect && (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="w-3 h-3 text-white"
                          />
                        )}
                      </div>
                      <span
                        className={
                          isCorrect
                            ? "font-medium text-green-700"
                            : "text-gray-600"
                        }
                      >
                        {option.text}
                      </span>
                    </div>
                    {isCorrect && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Correct Answer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error || "Quiz not found"}
          </h2>
          <Button onClick={() => router.push("/")} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="w-full h-16 px-6 py-4 flex items-center justify-between border-b bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            Back
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-6 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <div>
                <h1 className="font-extrabold text-2xl text-gray-900">
                  {quiz.name}
                </h1>
                {quiz.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {quiz.description}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-4 mt-2">
                <p className="text-sm text-gray-600">
                  {quiz.questions.length} question
                  {quiz.questions.length !== 1 ? "s" : ""}
                </p>
                <div className="h-4 border-l border-gray-300"></div>
                <p className="text-sm text-gray-600">ID: {quiz.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="mb-4">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-blue-700">
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg self-center font-semibold text-gray-900">
                    {question.title}
                  </h3>
                </div>
              </div>

              {renderQuestionContent(question, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
