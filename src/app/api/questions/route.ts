import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/lib/chatglm';

export async function POST(request: NextRequest) {
    try {
        const { topic, difficulty, count } = await request.json();
        const questions = await generateQuestions({ topic, difficulty, count });
        return NextResponse.json(questions);
    } catch (error) {
        console.error('Error generating questions:', error);
        return NextResponse.json(
            { error: '生成问题时发生错误' },
            { status: 500 }
        );
    }
}