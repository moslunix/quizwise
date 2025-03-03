import OpenAI from "openai";

console.log('deepseek : ' + process.env.DEEPSEEK_API_KEY);
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY
});

export interface QuestionGenerationParams {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  count: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export async function generateQuestions(params: QuestionGenerationParams): Promise<Question[]> {
    const prompt = `请生成 ${params.count} 道关于 ${params.topic} 的${params.difficulty}难度的选择题。

    要求如下：
    1. 每个问题必须包含题目描述和4个选项(A、B、C、D)
    2. 每个选项前必须使用字母标记（如：A. 选项内容）
    3. 每道题必须注明正确答案（格式：Answer: 选项内容）
    4. 每道题必须包含详细的解释（格式：Explanation: 解释内容）
    5. 题目之间使用空行分隔
    
    请确保输出格式严格遵循以下示例：
    
    1. 示例问题？
    A. 选项1
    B. 选项2
    C. 选项3
    D. 选项4
    Answer: 选项内容
    Explanation: 解释内容`;

  try {

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that generates high-quality multiple choice questions.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        model: "deepseek-chat",
    });
    
    console.log(completion.choices[0].message.content);

    const rawQuestions = completion.choices[0].message.content;
    
    return (rawQuestions ?? '').split('\n\n')
        .filter((q: string) => q.trim())
        .map((q: string, index: number) => {
            const lines = q.split('\n');
            const questionLine = lines[0].replace(/^\d+\.\s*/, '');
            
            const options = lines.slice(1, 5).map(line => {
                return line.replace(/^[A-D]\.\s*/, '');
            });
            
            const answerLine = lines.find(line => line.toLowerCase().includes('answer:'));
            const explanationLine = lines.find(line => line.toLowerCase().includes('explanation:'));
            
            const correctAnswer = answerLine ? answerLine.replace(/^answer:\s*/i, '').trim() : 'A';
            const explanation = explanationLine ? explanationLine.replace(/^explanation:\s*/i, '').trim() : '';
            
            return {
                id: `q${index + 1}`,
                question: questionLine,
                options: options,
                correctAnswer: correctAnswer,
                explanation: explanation
            };
        });
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}