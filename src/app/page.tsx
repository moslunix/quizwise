'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Question } from '@/lib/deepseek';
import { QuestionGenerationParams } from '@/lib/deepseek';

interface FormData {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  count: number;
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  const form = useForm<FormData>({
    defaultValues: {
      topic: '',
      difficulty: 'medium',
      count: 5
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('生成问题失败');
      }
  
      const generatedQuestions = await response.json();
      const questionsParam = encodeURIComponent(JSON.stringify(generatedQuestions));
      window.location.href = `/quiz?questions=${questionsParam}`;
    } catch (error) {
      console.error('Error:', error);
      // 在这里可以添加错误提示UI
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="container mx-auto p-4 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">AI问题生成系统</h1>
      
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>生成新问题</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>主题</FormLabel>
                      <FormControl>
                        <Input placeholder="输入问题主题" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>难度</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择难度" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">简单</SelectItem>
                          <SelectItem value="medium">中等</SelectItem>
                          <SelectItem value="hard">困难</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>问题数量</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          {...field}
                          onChange={e => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '生成中...' : '生成问题'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {questions.length > 0 && (
          <div className="space-y-4">
            {questions.map((question) => (
              <Card key={question.id}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">{question.question}</h3>
                  <div className="space-y-2">
                    {question.options.map((option, index) => {
                      const isAnswered = userAnswers[question.id] !== undefined;
                      const isSelected = userAnswers[question.id] === option;
                      const isCorrect = question.correctAnswer === option;
                      
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className={`w-full justify-start ${isAnswered ? (isCorrect ? 'bg-green-100' : (isSelected ? 'bg-red-100' : '')) : ''}`}
                          onClick={() => {
                            if (!isAnswered) {
                              setUserAnswers(prev => ({ ...prev, [question.id]: option }));
                              setShowExplanations(prev => ({ ...prev, [question.id]: true }));
                            }
                          }}
                          disabled={isAnswered}
                        >
                          {option}
                        </Button>
                      );
                    })}
                  </div>
                  {showExplanations[question.id] && (
                    <div className="mt-4">
                      <p className={`text-sm ${userAnswers[question.id] === question.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                        {userAnswers[question.id] === question.correctAnswer ? '回答正确！' : '回答错误。'}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">解释：</span>
                        {question.explanation}
                      </p>
                    </div>
                  )}
                  <p className="mt-4 text-sm text-gray-600">
                    <span className="font-semibold">解释：</span>
                    {question.explanation}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
