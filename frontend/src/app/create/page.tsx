/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Question, quizApi } from "@/lib/api";
import {
  faArrowLeft,
  faCheckSquare,
  faFont,
  faListUl,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface QuizFormData {
  name: string;
  description: string;
  questions: Question[];
}

const questionTypes = [
  {
    value: "short-text" as const,
    label: "Short Text",
    icon: faFont,
    description: "Open-ended text response",
  },
  {
    value: "boolean" as const,
    label: "True/False",
    icon: faCheckSquare,
    description: "Yes/No or True/False question",
  },
  {
    value: "multiple-choice" as const,
    label: "Multiple Choice",
    icon: faListUl,
    description: "Choose from multiple options",
  },
];

export default function CreateQuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<QuizFormData>({
    name: "",
    description: "",
    questions: [
      {
        title: "",
        type: "multiple-choice",
        options: [
          { id: 1, text: "" },
          { id: 2, text: "" },
        ],
        answer: 1,
      },
    ],
  });

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          title: "",
          type: "multiple-choice",
          options: [
            { id: 1, text: "" },
            { id: 2, text: "" },
          ],
          answer: 1,
        },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    if (formData.questions.length > 1) {
      setFormData({
        ...formData,
        questions: formData.questions.filter((_, i) => i !== index),
      });
    }
  };

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | number | boolean | Question["options"]
  ) => {
    const updatedQuestions = formData.questions.map((question, i) => {
      if (i === index) {
        const updatedQuestion = { ...question, [field]: value };

        if (field === "type") {
          switch (value) {
            case "short-text":
              return {
                title: question.title,
                type: value as "short-text",
                placeholder: "",
                answer: "",
              };
            case "boolean":
              return {
                title: question.title,
                type: value as "boolean",
                answer: true,
              } as Question;
            case "multiple-choice":
              return {
                title: question.title,
                type: value as "multiple-choice",
                options: [
                  { id: 1, text: "" },
                  { id: 2, text: "" },
                ],
                answer: 1,
              };
            default:
              return updatedQuestion;
          }
        }

        return updatedQuestion;
      }
      return question;
    });
    setFormData({ ...formData, questions: updatedQuestions});
  };

  const addOption = (questionIndex: number) => {
    const question = formData.questions[questionIndex];
    if (question.type === "multiple-choice" && question.options) {
      const newId = Math.max(...question.options.map((opt) => opt.id)) + 1;
      updateQuestion(questionIndex, "options", [
        ...question.options,
        { id: newId, text: "" },
      ]);
    }
  };

  const removeOption = (questionIndex: number, optionId: number) => {
    const question = formData.questions[questionIndex];
    if (
      question.type === "multiple-choice" &&
      question.options &&
      question.options.length > 2
    ) {
      const updatedOptions = question.options.filter(
        (opt) => opt.id !== optionId
      );
      updateQuestion(questionIndex, "options", updatedOptions);

      if (question.answer === optionId) {
        updateQuestion(questionIndex, "answer", updatedOptions[0]?.id || 1);
      }
    }
  };

  const updateOption = (
    questionIndex: number,
    optionId: number,
    text: string
  ) => {
    const question = formData.questions[questionIndex];
    if (question.type === "multiple-choice" && question.options) {
      const updatedOptions = question.options.map((opt) =>
        opt.id === optionId ? { ...opt, text } : opt
      );
      updateQuestion(questionIndex, "options", updatedOptions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a quiz name");
      return;
    }

    if (formData.questions.some((q) => !q.title.trim())) {
      alert("Please fill in all question titles");
      return;
    }

    for (const question of formData.questions) {
      if (question.type === "multiple-choice") {
        if (
          !question.options ||
          question.options.some((opt) => !opt.text.trim())
        ) {
          alert("Please fill in all multiple choice options");
          return;
        }
      }
    }

    try {
      setLoading(true);
      await quizApi.create(formData);
      router.push("/");
    } catch (error) {
      alert("Failed to create quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionFields = (question: Question, questionIndex: number) => {
    switch (question.type) {
      case "short-text":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder Text
            </label>
            <input
              type="text"
              value={question.placeholder || ""}
              onChange={(e) =>
                updateQuestion(questionIndex, "placeholder", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter placeholder text for user input"
            />
          </div>
        );

      case "boolean":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`boolean-${questionIndex}`}
                  checked={question.answer === true}
                  onChange={() => updateQuestion(questionIndex, "answer", true)}
                  className="text-blue-600 mr-2"
                />
                True
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`boolean-${questionIndex}`}
                  checked={question.answer === false}
                  onChange={() =>
                    updateQuestion(questionIndex, "answer", false)
                  }
                  className="text-blue-600 mr-2"
                />
                False
              </label>
            </div>
          </div>
        );

      case "multiple-choice":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Options
            </label>
            <div className="space-y-2">
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${questionIndex}`}
                    checked={question.answer === option.id}
                    onChange={() =>
                      updateQuestion(questionIndex, "answer", option.id)
                    }
                    className="text-blue-600"
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      updateOption(questionIndex, option.id, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${option.id}`}
                    required
                  />
                  {question.options && question.options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(questionIndex, option.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addOption(questionIndex)}
                className="mt-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-3 h-3 mr-1" />
                Add Option
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
          <h1 className="font-extrabold text-2xl text-gray-900">Create Quiz</h1>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? "Creating..." : "Create Quiz"}
        </Button>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quiz Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quiz name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {formData.questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Question {questionIndex + 1}
                  </h3>
                  {formData.questions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Type *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {questionTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() =>
                            updateQuestion(questionIndex, "type", type.value)
                          }
                          className={`p-3 border rounded-lg text-left transition-colors ${
                            question.type === type.value
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <FontAwesomeIcon
                              icon={type.icon}
                              className="w-4 h-4"
                            />
                            <span className="font-medium">{type.label}</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {type.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Title *
                    </label>
                    <input
                      type="text"
                      value={question.title}
                      onChange={(e) =>
                        updateQuestion(questionIndex, "title", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your question"
                      required
                    />
                  </div>

                  {renderQuestionFields(question, questionIndex)}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addQuestion}
              className="w-full flex items-center gap-2 py-3"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
              Add Question
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
