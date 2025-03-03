# QuizWise - AI驱动的问题生成系统

## 项目简介
QuizWise 是一个基于人工智能的问题生成系统，能够根据指定主题、难度和数量自动生成高质量的选择题。

## 主要功能
- 自定义主题生成问题
- 支持多个难度级别（简单、中等、困难）
- 每个问题都包含详细解释
- 现代化的用户界面

## 技术栈
- Next.js
- TypeScript
- Tailwind CSS
- OpenAI API

## 本地开发
1. 克隆仓库
```bash
git clone [仓库地址]
cd quizwise
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 .env.local 文件并添加以下配置：
```
CHATGLM_API_KEY=你的API密钥
DEEPSEEK_API_KEY=你的API密钥
```

4. 启动开发服务器
```bash
npm run dev
```

## 部署
本项目使用 Vercel 进行部署。在 Vercel 上部署时，请确保设置以下环境变量：
- CHATGLM_API_KEY
- DEEPSEEK_API_KEY

## 许可证
MIT License
