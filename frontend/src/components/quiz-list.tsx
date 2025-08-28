import React from "react";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type Quiz = {
  id: string;
  title: string;
  description?: string;
};


type QuizListProps = {
  quizzes: Quiz[];
  onSelectQuiz?: (quizId: string) => void;
  onDeleteQuiz?: (quizId: string) => void;
};

const QuizList: React.FC<QuizListProps> = ({ quizzes, onSelectQuiz, onDeleteQuiz }) => {
  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No quizzes yet
        </h3>
        <p className="text-gray-500">
          Create your first quiz to get started!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {quiz.title}
              </h3>
              {quiz.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {quiz.description}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => onSelectQuiz?.(quiz.id)}
                  variant="default"
                  size="sm"
                  className="flex-1"
                >
                  View Quiz
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteQuiz?.(quiz.id)}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
