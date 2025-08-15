# 🎭 AI小说风格学习生成器

这是一个基于LLM API的智能小说生成系统，能够学习任意作家的写作风格，生成具有相同风格特色的小说内容。支持上传任意TXT文件进行风格学习，包括但不限于墨香铜臭、金庸、古龙等作家的作品。

## ✨ 功能特点

- **智能风格学习**：自动分析任意作家的真实小说，提取写作风格特征
- **LLM驱动生成**：基于DeepSeek（推荐）或OpenAI等大语言模型，生成高质量小说内容
- **分章节创作**：智能分解大纲，逐章生成，保证情节连贯性
- **前后端分离**：React前端 + Flask后端，现代化架构设计
- **文件编码自动检测**：支持多种编码格式，自动处理乱码问题
- **多API支持**：优先使用DeepSeek API，支持OpenAI作为备用

## 🚀 快速开始

### 1. 环境要求

- Python 3.7+
- Node.js 16+
- OpenAI API密钥

### 2. 安装依赖

#### 后端依赖
```bash
pip install -r requirements.txt
```

#### 前端依赖
```bash
npm install
```

### 3. 配置环境变量

复制环境变量示例文件：
```bash
cp env.example .env
```

编辑`.env`文件，填入你的DeepSeek API密钥（推荐）或OpenAI API密钥：
```
# 推荐使用DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_BASE_URL=https://api.deepseek.com/v1

# 或者使用OpenAI API作为备用
# OPENAI_API_KEY=your_openai_api_key_here
```

### 4. 启动服务

#### 使用启动脚本（推荐）
```bash
python start.py
```

#### 手动启动

**后端服务：**
```bash
python app.py
```
后端地址：http://localhost:5000

**前端服务：**
```bash
npm run dev
```
前端地址：http://localhost:8080

## 📚 使用方法

1. **上传风格范本**：上传任意作家的TXT小说文件（如墨香铜臭、金庸、古龙等）
2. **输入故事大纲**：描述你想要的故事情节
3. **设置目标字数**：选择生成的小说长度
4. **开始生成**：AI将分析风格并创作小说
5. **下载结果**：获取生成的小说文件

## 🏗️ 系统架构

```
前端 (React + Vite) ←→ 后端 (Flask + OpenAI API) ←→ LLM服务
```

- **前端**：用户界面，文件上传，结果展示
- **后端**：API服务，文件处理，风格分析
- **核心引擎**：小说生成器，章节管理，风格迁移

## 🔧 技术栈

- **前端**：React 18, Vite, Tailwind CSS, Radix UI
- **后端**：Flask, Flask-CORS, OpenAI Python SDK
- **AI服务**：DeepSeek（推荐）、OpenAI GPT-3.5/4, Claude, Gemini等
- **文件处理**：chardet编码检测，多格式支持

## 📁 项目结构

```
自动生成墨香铜臭风格的小说的工具/
├── app.py                    # Flask后端API
├── novel_generator.py        # 核心小说生成器
├── requirements.txt          # Python依赖
├── start.py                 # 启动脚本
├── env.example              # 环境变量示例
├── src/                     # React前端源码
│   ├── pages/              # 页面组件
│   └── components/         # UI组件
└── 墨香铜臭小说文件/         # 风格范本
```

## 🎯 核心算法

1. **风格分析**：使用LLM分析文本的写作特征
2. **大纲分解**：智能分解用户输入的故事大纲
3. **迭代生成**：逐章生成，保持情节连贯性
4. **风格迁移**：将学习到的风格应用到新创作中

## 🐛 故障排除

### 常见问题

1. **API密钥错误**：检查.env文件中的DEEPSEEK_API_KEY或OPENAI_API_KEY设置
2. **依赖安装失败**：确保Python和Node.js版本符合要求
3. **端口占用**：修改app.py中的端口号
4. **文件编码问题**：系统会自动检测和转换编码

### 调试模式

启动后端时添加调试信息：
```bash
FLASK_DEBUG=1 python app.py
```

## 📄 许可证

本项目仅供学习和研究使用，请勿用于商业用途。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个工具！

## 🙏 致谢

感谢所有优秀的作家创作了如此精彩的作品，为我们的学习和创作提供了丰富的素材。特别感谢墨香铜臭、金庸、古龙等作家的经典作品。
