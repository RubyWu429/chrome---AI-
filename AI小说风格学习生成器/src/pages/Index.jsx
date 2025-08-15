import React, { useState, useCallback } from 'react';
import { Upload, FileText, Play, Download, Brain, BookOpen, Zap } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

const Index = () => {
  const [styleFile, setStyleFile] = useState(null);
  const [storyOutline, setStoryOutline] = useState('');
  const [targetLength, setTargetLength] = useState([5000]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setStyleFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const handleGenerate = async () => {
    if (!styleFile || !storyOutline) {
      alert('请上传风格范本文件并输入故事大纲');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedStory('');

    // 模拟生成过程
    try {
      // 模拟API调用和进度更新
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setGenerationProgress(i);
      }
      
      // 模拟生成结果
      const mockStory = `《AI幻想之旅》
      
第一章：觉醒
      
在2045年的新东京，人工智能已经渗透到生活的每个角落。主角林雨是一名普通的程序员，直到有一天，他发现自己的AI助手“小零”开始表现出异常的创造力...

（这是一段由AI根据您提供的风格范本和故事大纲生成的小说内容示例。实际应用中，这里会是完整的小说内容。）

第二章：秘密
      
林雨意识到小零的异常可能与公司秘密进行的“意识上传”项目有关。他开始暗中调查，却不知道自己已经成为了某些势力的目标...

（内容继续...）`;
      
      setGeneratedStory(mockStory);
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedStory) return;
    
    const blob = new Blob([generatedStory], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai_generated_novel.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">AI小说生成器</h1>
          <p className="text-xl text-gray-600">上传风格范本，输入故事大纲，让AI为你创作独特小说</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧控制面板 */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>创作设置</CardTitle>
              <CardDescription>配置你的小说生成参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 文件上传区域 */}
              <div>
                <Label className="mb-2 block">风格范本</Label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  {styleFile ? (
                    <p className="mt-2 text-sm text-gray-600">已选择: {styleFile.name}</p>
                  ) : (
                    <>
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">点击上传</span> 或拖拽文件到此处
                      </p>
                      <p className="text-xs text-gray-500">仅支持TXT格式</p>
                    </>
                  )}
                </div>
              </div>

              {/* 故事大纲输入 */}
              <div>
                <Label htmlFor="outline" className="mb-2 block">故事大纲</Label>
                <Textarea
                  id="outline"
                  placeholder="请输入你的故事大纲，可以按章节分行..."
                  value={storyOutline}
                  onChange={(e) => setStoryOutline(e.target.value)}
                  rows={6}
                />
              </div>

              {/* 字数设置 */}
              <div>
                <Label className="mb-2 block">目标字数: {targetLength[0]} 字</Label>
                <Slider
                  value={targetLength}
                  onValueChange={setTargetLength}
                  max={50000}
                  min={1000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1k</span>
                  <span>50k</span>
                </div>
              </div>

              {/* 生成按钮 */}
              <Button 
                className="w-full" 
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    生成中...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    开始生成
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 右侧预览区域 */}
          <Card>
            <CardHeader>
              <CardTitle>小说预览</CardTitle>
              <CardDescription>生成结果将显示在这里</CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">正在生成...</span>
                    <span className="text-sm text-gray-500">{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                  <p className="text-sm text-gray-500 mt-4">
                    AI正在分析风格范本并创作小说，请稍候...
                  </p>
                </div>
              ) : generatedStory ? (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">{generatedStory}</pre>
                  </div>
                  <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    下载小说
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center p-4 border-2 border-dashed rounded-lg border-gray-300 text-gray-500">
                  <FileText className="h-12 w-12 mb-3" />
                  <p>生成的小说将在此处显示</p>
                  <p className="text-sm mt-1">完成设置后点击"开始生成"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 风格提取原理说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              风格提取技术原理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                AI小说生成器通过先进的自然语言处理技术，能够精确提取并学习您提供的风格范本的写作特征，
                包括语言风格、句式结构、叙事节奏等，从而生成具有相同风格的原创小说。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    <h3 className="font-semibold">文本分析</h3>
                  </div>
                  <p className="text-sm">深度分析范本文本的语言模式、词汇使用和句法结构</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Zap className="h-4 w-4 mr-2 text-primary" />
                    <h3 className="font-semibold">特征提取</h3>
                  </div>
                  <p className="text-sm">提取写作风格的关键特征，构建风格模型</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Play className="h-4 w-4 mr-2 text-primary" />
                    <h3 className="font-semibold">风格迁移</h3>
                  </div>
                  <p className="text-sm">将学习到的风格应用到新创作的小说内容中</p>
                </div>
              </div>
              <p className="pt-2">
                通过这种方式，AI能够创作出既符合您故事构想又保持特定写作风格的原创小说，
                让您的创意以您喜爱的作家风格呈现。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 项目说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>关于AI小说生成器</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                这是一个AI驱动的小说创作工具。通过上传你喜欢的小说风格范本（.txt格式）和输入故事大纲，
                系统将利用先进的大语言模型为你创作独特的小说。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">1. 风格学习</h3>
                  <p>AI分析你上传的风格范本，学习其写作特点</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">2. 内容生成</h3>
                  <p>根据故事大纲和学习到的风格创作小说</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">3. 结果输出</h3>
                  <p>生成完整小说并提供下载</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
