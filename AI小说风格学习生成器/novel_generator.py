#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI小说风格学习生成器 - 核心生成逻辑 (V2 - Refactored)
基于LLM API的智能小说生成系统，支持任意写作风格学习
"""

import os
import time
import chardet
import requests
from typing import List, Dict, Any, Optional
from openai import OpenAI
from dotenv import load_dotenv

# 在全局作用域加载环境变量，确保在任何实例创建前都已加载
load_dotenv()

class NovelGenerator:
    """
    小说生成器核心类。
    经过重构，使用最新的OpenAI客户端，并提升了代码的模块化和灵活性。
    """
    
    def __init__(self):
        """初始化生成器，配置API客户端。"""
        # 优先使用DeepSeek API
        self.deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
        self.deepseek_api_base = os.getenv('DEEPSEEK_API_BASE_URL', 'https://api.deepseek.com/v1')
        
        # 备用OpenAI API
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        
        if not self.deepseek_api_key and not self.openai_api_key:
            print("⚠️  警告：未在 .env 文件中设置 DEEPSEEK_API_KEY 或 OPENAI_API_KEY 环境变量。将使用备用模式。")
            self.client = None
        else:
            # 优先使用DeepSeek，备用OpenAI
            if self.deepseek_api_key:
                print("✅ 使用DeepSeek API")
                self.client = None  # DeepSeek使用requests直接调用
            else:
                print("✅ 使用OpenAI API")
                self.client = OpenAI(api_key=self.openai_api_key)
    
    def _make_api_call(self, messages: List[Dict[str, str]], model: str = "deepseek-chat", max_tokens: int = 2000, temperature: float = 0.7) -> Optional[str]:
        """
        统一的API调用函数，支持DeepSeek和OpenAI。
        :return: 成功时返回生成的文本，失败时返回None。
        """
        # 优先使用DeepSeek API
        if self.deepseek_api_key:
            return self._call_deepseek_api(messages, model, max_tokens, temperature)
        # 备用OpenAI API
        elif self.client:
            return self._call_openai_api(messages, model, max_tokens, temperature)
        else:
            return None
    
    def _call_deepseek_api(self, messages: List[Dict[str, str]], model: str, max_tokens: int, temperature: float) -> Optional[str]:
        """调用DeepSeek API"""
        try:
            headers = {
                'Authorization': f'Bearer {self.deepseek_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': model,
                'messages': messages,
                'max_tokens': max_tokens,
                'temperature': temperature
            }
            
            response = requests.post(
                f"{self.deepseek_api_base}/chat/completions",
                headers=headers,
                json=data,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content']
            else:
                print(f"❌ DeepSeek API调用失败: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ DeepSeek API调用异常: {e}")
            return None
    
    def _call_openai_api(self, messages: List[Dict[str, str]], model: str, max_tokens: int, temperature: float) -> Optional[str]:
        """调用OpenAI API"""
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"❌ OpenAI API调用失败: {e}")
            return None

    def analyze_style(self, style_text: str) -> str:
        """
        分析写作风格。
        :param style_text: 用于分析风格的文本范本。
        :return: 生成的风格指南。
        """
        print("1. 🔍 正在分析写作风格...")
        # 截取代表性片段进行分析，防止文本过长
        sample_text = style_text[:4000]
        
        prompt = f"""你是一位文学评论家。请深入分析以下文段的写作风格，并从以下几个维度进行总结：

1.  **叙事语调**: 例如冷静、幽默、悬疑、古风雅致、仙侠风格等。
2.  **句子结构**: 例如偏好长句或短句，结构是否复杂，是否多用排比、对仗等修辞。
3.  **词汇选择**: 例如是华丽还是朴实，是否多用古风词汇、特定领域的术语（如修仙）。
4.  **对话风格**: 例如是直接还是含蓄，是否符合人物身份和时代背景。
5.  **描写手法**: 特别是环境、动作和人物心理的描写方式，是否注重细节。
6.  **情感表达**: 例如是含蓄内敛还是直白热烈。

请给出一份详细、具体且可操作的'风格指南'，用中文回答，格式清晰。

文段内容：
---
{sample_text}
---
"""
        messages = [{"role": "user", "content": prompt}]
        style_guide = self._make_api_call(messages, model="deepseek-chat", max_tokens=1500, temperature=0.5)
        
        if style_guide:
            print("   ✅ 风格分析完成。")
            return style_guide
        else:
            print("   ⚠️ 风格分析失败，使用默认风格指南。")
            return self._get_default_style_guide()

    def generate_chapter(self, outline_part: str, chapter_num: int, style_guide: str, previous_summary: str = "", character_info: str = "") -> str:
        """
        生成单个章节。
        """
        print(f"   - 正在生成第 {chapter_num} 章...")
        
        # 构建Prompt
        if chapter_num == 1:
            context_prompt = "现在，请根据以下故事大纲的第一部分，撰写小说的开篇章节。"
        else:
            context_prompt = f"前情提要：\n{previous_summary}\n\n现在，请续写第 {chapter_num} 章，确保情节连贯。"

        prompt = f"""你是一位模仿能力极强的专业小说家。

{character_info}

请严格遵循以下的写作风格指南来创作：
--- STYLE GUIDE START ---
{style_guide}
--- STYLE GUIDE END ---

{context_prompt}

本章大纲：
--- OUTLINE START ---
{outline_part}
--- OUTLINE END ---

创作要求：
1.  严格遵循给定的风格指南和人物设定进行创作。
2.  情节需围绕本章大纲展开，并与前情提要（如有）平滑衔接。
3.  本章字数约1500-2000字。
4.  章节需有完整的结构，包含开头、发展和结尾，并为后续情节留下悬念或铺垫。
5.  章节标题格式：第{chapter_num}章 [请在此处构思一个贴切的章节标题]

请开始你的创作：
"""
        messages = [{"role": "user", "content": prompt}]
        chapter_content = self._make_api_call(messages, model="deepseek-chat", max_tokens=2500, temperature=0.8)
        
        if chapter_content:
            return chapter_content
        else:
            print(f"   ⚠️ 第 {chapter_num} 章生成失败，使用备用内容。")
            return self._get_fallback_chapter(outline_part, chapter_num)
    
    def generate_summary(self, chapter_content: str, chapter_num: int) -> str:
        """为单个章节生成摘要，用于下一章的上下文。"""
        print(f"   - 正在为第 {chapter_num} 章生成摘要...")
        prompt = f"""请为以下小说章节内容，生成一个简洁、精炼的摘要，用于作为下一章创作的“前情提要”。

章节内容：
---
{chapter_content[:3000]} 
---

摘要要求：
1.  长度在150字以内。
2.  准确概括本章的核心情节、关键转折和人物的重要行动或状态变化。
3.  语言风格与原文保持一致。

摘要：
"""
        messages = [{"role": "user", "content": prompt}]
        summary = self._make_api_call(messages, model="deepseek-chat", max_tokens=300, temperature=0.4)
        
        if summary:
            return summary
        else:
            print("   ⚠️ 摘要生成失败，使用默认摘要。")
            return "本章讲述了主角的成长历程，面临挑战并最终获得领悟。"

    def generate_novel(self, style_text: str, outline: str, target_length: int, title: str = "云深不知处的传说", character_info: str = "") -> Dict[str, Any]:
        """
        生成完整小说的总控函数。
        """
        start_time = time.time()
        
        # 1. 分析风格
        style_guide = self.analyze_style(style_text)
        
        # 2. 分解大纲
        outline_parts = [part.strip() for part in outline.split('\n') if part.strip()]
        if not outline_parts:
            # 如果大纲为空，提供一个默认大纲
            outline_parts = [
                "主角在一个雨夜中醒来，发现自己身处一个陌生的地方，身边只有一把古老的剑。",
                "在探索中，主角遇到了神秘的引路人，得知自己身负重要的使命。",
                "为了完成使命，主角必须前往传说中的“不归谷”，途中遇到了志同道合的伙伴，也遭遇了第一波敌人的阻拦。",
                "在伙伴的帮助下，主角克服了困难，并初步掌握了古剑中蕴含的力量，为接下来的旅程做好了准备。"
            ]
        
        # 3. 计算章节数
        num_chapters = max(1, min(len(outline_parts), target_length // 1500))
        print(f"2. 📝 计划生成 {num_chapters} 个章节...")
        
        # 4. 迭代生成章节
        chapters = []
        previous_summary = ""
        generation_details = []
        
        for i in range(num_chapters):
            chapter_num = i + 1
            chapter_start_time = time.time()
            
            outline_part = outline_parts[i]
            chapter_content = self.generate_chapter(outline_part, chapter_num, style_guide, previous_summary, character_info)
            chapters.append(chapter_content)
            
            # 为下一次迭代生成摘要
            if i < num_chapters - 1:
                previous_summary = self.generate_summary(chapter_content, chapter_num)
                # 避免API调用过于频繁
                time.sleep(1) 

            # 记录生成详情
            chapter_time = time.time() - chapter_start_time
            generation_details.append({
                "chapter": chapter_num,
                "outline": outline_part,
                "word_count": len(chapter_content),
                "generation_time": round(chapter_time, 2)
            })
        
        # 5. 组合成完整小说
        full_novel_content = "\n\n".join(chapters)
        complete_novel = f"# {title}\n\n{full_novel_content}"
        
        total_time = time.time() - start_time
        print(f"3. ✅ 小说生成完毕！总耗时: {total_time:.2f} 秒。")
        
        return {
            "title": title,
            "content": complete_novel,
            "total_chapters": num_chapters,
            "total_words": len(complete_novel),
            "total_time_seconds": round(total_time, 2),
            "style_guide": style_guide,
            "generation_details": generation_details,
        }

    # --- 备用方法 (Fallback Methods) ---
    def _get_default_style_guide(self) -> str:
        """当API不可用时，获取默认的风格指南。"""
        return """**默认古风仙侠风格指南**
1.  **叙事语调**: 古风雅致，仙侠气息浓厚，常带有淡淡的悬念和宿命感。
2.  **句子结构**: 多用长句，善于运用对仗、排比，形成富有节奏感的文风。
3.  **词汇选择**: 词藻华丽，多用古风词汇、成语及修仙相关术语（如：灵力、心法、洞府、法器）。
4.  **对话风格**: 含蓄内敛，人物对话常点到为止，富含潜台词，符合人物身份。
5.  **描写手法**: 注重细节，特别是对山水景物、人物衣着、神态和心理活动的细腻刻画。
6.  **情感表达**: 情感深沉，不轻易外露，多通过景物描写和人物的细微动作来烘托。"""

    def _get_fallback_chapter(self, outline_part: str, chapter_num: int) -> str:
        """当API不可用时，生成备用的章节内容。"""
        return f"""### 第{chapter_num}章 迷雾中的启程

（备用生成内容）

基于大纲“{outline_part}”，故事于此展开。

月色如水，洒在一片未知的古林之中。主角缓缓睁开双眼，只觉头痛欲裂，四周的景象全然陌生。他挣扎着坐起，手边触及一片冰凉，竟是一柄通体黝黑、刻有古老符文的长剑。这柄剑，似乎与他有着某种神秘的联系。

正当他迷茫之际，林深之处传来一阵轻微的脚步声。一位身着白袍、面容模糊的身影出现在他面前，声音空灵地说道：“你终于醒了。命运的齿轮已经开始转动，你的旅程，现在才刚刚开始。”

这段简短的备用内容旨在确保程序流程可以走完，实际内容需由API生成。
"""


if __name__ == "__main__":
    print("--- 开始测试小说生成器核心逻辑 ---")
    
    # 确保你的.env文件中有 DEEPSEEK_API_KEY 或 OPENAI_API_KEY
    if not os.getenv('DEEPSEEK_API_KEY') and not os.getenv('OPENAI_API_KEY'):
        print("\n错误：请先在项目根目录创建 .env 文件，并填入你的 DEEPSEEK_API_KEY 或 OPENAI_API_KEY。")
        print("例如: DEEPSEEK_API_KEY='sk-xxxxxxxxxxxxxxxxxxxxxxxx'")
        print("或者: OPENAI_API_KEY='sk-xxxxxxxxxxxxxxxxxxxxxxxx'")
    else:
        # 1. 初始化生成器
        generator = NovelGenerator()
        
        # 2. 准备测试数据
        # 在实际应用中，这部分内容将来自用户上传的文件和网页输入
        mock_style_text = """
        他逢乱必出。
        是非在己，毁誉由人，得失不论。
        蓝忘机摇头，道：“兄长，我想带一人回云深不知处。”
        他望着下方那片滚滚奔流的江水，半晌才对身旁的蓝曦臣道：“兄长，我，想带一人回云深不知处。”
        蓝曦臣有些诧异。
        带回去？
        带回去……藏起来。
        """
        
        mock_outline = """
        第一章：主角蓝忘机在夷陵乱葬岗找到了重伤濒死的魏无羡。
        第二章：蓝忘机不顾家族反对，将魏无羡带回云深不知处，藏于山洞中悉心照料。
        第三章：在照料过程中，两人回忆起少年时的种种过往，情感逐渐升温，但也面临着被发现的危险。
        """

        mock_character_info = """
主要人物设定：
-   **蓝忘机**: 性格冷淡，雅正端方，内心情感深沉。佩剑“避尘”，古琴“忘机”。
-   **魏无羡**: 性格不羁，明朗豁达，但此刻身受重伤，身体虚弱，精神状态不稳定。
"""
        
        # 3. 调用主函数生成小说
        novel_result = generator.generate_novel(
            style_text=mock_style_text,
            outline=mock_outline,
            target_length=4500, # 期望总长度约4500字 (3章 * 1500字/章)
            title="归云",
            character_info=mock_character_info
        )
        
        # 4. 打印生成结果
        print("\n" + "="*50)
        print("🎉 小说生成完毕！ 🎉")
        print("="*50)
        print(f"标题: {novel_result['title']}")
        print(f"总章节: {novel_result['total_chapters']}")
        print(f"总字数: {novel_result['total_words']}")
        print(f"总耗时: {novel_result['total_time_seconds']}秒")
        print("\n--- 生成的风格指南 ---")
        print(novel_result['style_guide'])
        print("\n--- 生成详情 ---")
        for detail in novel_result['generation_details']:
            print(f"  - 章节 {detail['chapter']}: {detail['word_count']}字, 耗时 {detail['generation_time']}秒")
        
        print("\n--- 小说内容预览 (前500字) ---")
        print(novel_result['content'][:500] + "...")
        
        # 5. 将完整结果保存到文件
        file_name = "generated_novel_test.txt"
        with open(file_name, "w", encoding="utf-8") as f:
            f.write(novel_result['content'])