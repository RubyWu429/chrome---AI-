#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI小说风格学习生成器 - Flask后端API
连接前端界面和小说生成器核心逻辑，支持任意写作风格学习
"""

import os
import json
import tempfile
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from novel_generator import NovelGenerator
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)

# 创建全局生成器实例
generator = NovelGenerator()

@app.route('/')
def index():
    """主页重定向到前端"""
    return jsonify({
        "message": "墨香铜臭风格小说生成器API",
        "status": "running",
        "frontend": "请访问前端页面"
    })

@app.route('/api/health')
def health_check():
    """健康检查"""
    return jsonify({
        'status': 'healthy',
        'deepseek_configured': generator.deepseek_api_key is not None,
        'openai_configured': generator.openai_api_key is not None,
        'message': '小说生成器运行正常'
    })

@app.route('/api/generate', methods=['POST'])
def generate_novel():
    """生成小说API"""
    try:
        data = request.get_json()
        
        # 获取请求参数
        style_text = data.get('style_text', '')
        story_outline = data.get('story_outline', '')
        target_length = int(data.get('target_length', 5000))
        title = data.get('title', '云深不知处的传说')
        character_info = data.get('character_info', '')
        
        # 验证必要参数
        if not style_text or not story_outline:
            return jsonify({
                'success': False,
                'message': '请提供风格文本和故事大纲'
            }), 400
        
        print(f"🎭 开始生成小说，目标字数：{target_length}")
        
        # 调用生成器
        novel_result = generator.generate_novel(
            style_text=style_text,
            outline=story_outline,
            target_length=target_length,
            title=title,
            character_info=character_info
        )
        
        return jsonify({
            'success': True,
            'message': '小说生成成功！',
            'data': novel_result
        })
        
    except Exception as e:
        print(f"生成失败：{e}")
        return jsonify({
            'success': False,
            'message': f'生成失败：{str(e)}'
        }), 500

@app.route('/api/upload-style', methods=['POST'])
def upload_style_file():
    """上传风格文件API"""
    try:
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'message': '没有上传文件'
            }), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({
                'success': False,
                'message': '没有选择文件'
            }), 400
        
        if not file.filename.endswith('.txt'):
            return jsonify({
                'success': False,
                'message': '只支持TXT格式文件'
            }), 400
        
        # 读取文件内容
        try:
            content = file.read().decode('utf-8')
        except UnicodeDecodeError:
            try:
                file.seek(0)  # 重置文件指针
                content = file.read().decode('gbk')
            except UnicodeDecodeError:
                file.seek(0)
                content = file.read().decode('utf-8', errors='ignore')
        
        # 分析风格
        style_guide = generator.analyze_style(content)
        
        return jsonify({
            'success': True,
            'message': '风格分析完成',
            'data': {
                'filename': file.filename,
                'content': content,
                'style_guide': style_guide,
                'word_count': len(content)
            }
        })
        
    except Exception as e:
        print(f"文件上传失败：{e}")
        return jsonify({
            'success': False,
            'message': f'文件上传失败：{str(e)}'
        }), 500

@app.route('/api/download/<filename>')
def download_novel(filename):
    """下载小说文件"""
    try:
        # 这里应该实现文件下载逻辑
        # 为了简化，我们返回一个示例文件
        return jsonify({
            'success': True,
            'message': '下载功能开发中，请复制内容保存'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'下载失败：{str(e)}'
        }), 500

@app.route('/api/test')
def test_generator():
    """测试生成器功能"""
    try:
        # 使用测试数据
        test_style_text = """
        他逢乱必出。
        是非在己，毁誉由人，得失不论。
        蓝忘机摇头，道："兄长，我想带一人回云深不知处。"
        """
        
        test_outline = """
        第一章：主角在一个雨夜中醒来，发现自己身处一个陌生的地方。
        第二章：主角遇到了神秘的引路人，得知自己身负重要的使命。
        """
        
        test_character_info = """
主要人物设定：
- 主角：性格坚韧，具有特殊天赋的修仙者
- 引路人：神秘莫测，知晓主角身世的高人
"""
        
        # 生成测试小说
        novel_result = generator.generate_novel(
            style_text=test_style_text,
            outline=test_outline,
            target_length=3000,
            title="测试小说",
            character_info=test_character_info
        )
        
        return jsonify({
            'success': True,
            'message': '测试生成成功',
            'data': novel_result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'测试失败：{str(e)}'
        }), 500

if __name__ == '__main__':
    print("🎭 启动墨香铜臭风格小说生成器API...")
    print("🌐 访问地址：http://localhost:5000")
    print("📚 基于LLM API的智能小说生成系统")
    
    if not os.getenv('DEEPSEEK_API_KEY') and not os.getenv('OPENAI_API_KEY'):
        print("⚠️  注意：未设置DEEPSEEK_API_KEY或OPENAI_API_KEY，将使用备用生成模式")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
