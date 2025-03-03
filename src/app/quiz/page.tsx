'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Question } from '@/lib/deepseek';

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const questionsData = searchParams.get('questions');
    if (questionsData) {
      try {
        const parsedQuestions = JSON.parse(decodeURIComponent(questionsData));
        setQuestions(parsedQuestions);
      } catch (error) {
        console.error('Error parsing questions:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (option: string) => {
    setUserAnswer(option);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer(null);
      setShowExplanation(false);
    } else {
      router.push('/');
    }
  };

  if (!currentQuestion) {
    return null;
  }

  const isAnswered = userAnswer !== null;
  const isCorrect = userAnswer === currentQuestion.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          问题 {currentQuestionIndex + 1} / {questions.length}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">{currentQuestion.question}</h3>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => {
              const isSelected = userAnswer === option;
              const isCorrectOption = currentQuestion.correctAnswer === option;
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full justify-start ${
                    isAnswered
                      ? isCorrectOption
                        ? 'bg-green-100'
                        : isSelected
                        ? 'bg-red-100'
                        : ''
                      : ''
                  }`}
                  onClick={() => !isAnswered && handleAnswer(option)}
                  disabled={isAnswered}
                >
                  {option}
                </Button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="mt-4">
              <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '回答正确！' : '回答错误。'}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">解释：</span>
                {currentQuestion.explanation}
              </p>
              <Button
                className="w-full mt-4"
                onClick={handleNext}
              >
                {currentQuestionIndex < questions.length - 1 ? '下一题' : '完成'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function QuizPage() {
  return (
    <main className="container mx-auto p-4 min-h-screen">
      <Suspense fallback={<div className="text-center">加载中...</div>}>
        <QuizContent />
      </Suspense>
    </main>
  );
}