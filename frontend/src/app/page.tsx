"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuizList from "@/components/quiz-list";
import { Button } from "@/components/ui/button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { quizApi, Quiz } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const data = await quizApi.getAll();
        setQuizzes(data);
        setError(null);
      } catch (err) {
        setError('Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleCreateQuiz = () => {
    router.push('/create');
  };

  const handleSelectQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      await quizApi.delete(Number(quizId));
      setQuizzes(quizzes.filter(quiz => quiz.id.toString() !== quizId));
    } catch (error) {
      alert('Failed to delete quiz. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="w-full h-16 px-6 py-4 flex items-center justify-between border-b bg-white shadow-sm">
        <h1 className="font-extrabold text-3xl text-gray-900">Quizzes</h1>
        <Button 
          onClick={handleCreateQuiz}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Create Quiz
        </Button>
      </nav>
      <div className="container mx-auto px-6 py-8">
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading quizzes...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <QuizList 
            quizzes={quizzes.map(quiz => ({
              id: quiz.id.toString(),
              title: quiz.name,
              description: quiz.description
            }))}
            onSelectQuiz={handleSelectQuiz}
            onDeleteQuiz={handleDeleteQuiz}
          />
        )}
      </div>
    </main>
  );
}
