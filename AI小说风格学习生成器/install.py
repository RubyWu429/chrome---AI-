#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
墨香铜臭风格小说生成器 - 自动安装脚本
"""

import os
import sys
import subprocess
import platform

def print_banner():
    """打印安装横幅"""
    print("=" * 60)
    print("🎭 AI小说风格学习生成器 - 自动安装")
    print("=" * 60)
    print("✨ 正在为您配置开发环境...")
    print("=" * 60)

def check_python_version():
    """检查Python版本"""
    print("🐍 检查Python版本...")
    
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 7):
        print(f"❌ Python版本过低：{version.major}.{version.minor}")
        print("需要Python 3.7或更高版本")
        return False
    
    print(f"✅ Python版本：{version.major}.{version.minor}.{version.micro}")
    return True

def check_node_version():
    """检查Node.js版本"""
    print("\n🟢 检查Node.js版本...")
    
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✅ Node.js版本：{version}")
            return True
        else:
            print("❌ Node.js未安装")
            return False
    except FileNotFoundError:
        print("❌ Node.js未安装")
        return False

def install_python_dependencies():
    """安装Python依赖"""
    print("\n📦 安装Python依赖包...")
    
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '--upgrade', 'pip'], check=True)
        print("✅ pip已更新")
        
        # 安装依赖
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Python依赖安装完成")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Python依赖安装失败：{e}")
        return False

def install_node_dependencies():
    """安装Node.js依赖"""
    print("\n📦 安装Node.js依赖包...")
    
    try:
        subprocess.run(['npm', 'install'], check=True)
        print("✅ Node.js依赖安装完成")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Node.js依赖安装失败：{e}")
        return False

def setup_environment():
    """设置环境变量文件"""
    print("\n🔧 设置环境配置...")
    
    if not os.path.exists('.env'):
        if os.path.exists('env.example'):
            try:
                with open('env.example', 'r', encoding='utf-8') as src:
                    with open('.env', 'w', encoding='utf-8') as dst:
                        dst.write(src.read())
                print("✅ 已创建.env文件")
                print("⚠️  请编辑.env文件，填入你的OpenAI API密钥")
            except Exception as e:
                print(f"❌ 创建.env文件失败：{e}")
                return False
        else:
            print("❌ 未找到env.example文件")
            return False
    else:
        print("✅ .env文件已存在")
    
    return True

def create_directories():
    """创建必要的目录"""
    print("\n📁 创建项目目录...")
    
    directories = ['logs', 'output', 'temp']
    
    for directory in directories:
        if not os.path.exists(directory):
            try:
                os.makedirs(directory)
                print(f"✅ 创建目录：{directory}")
            except Exception as e:
                print(f"❌ 创建目录失败：{directory} - {e}")
    
    return True

def test_installation():
    """测试安装"""
    print("\n🧪 测试安装...")
    
    try:
        # 测试Python模块导入
        import flask
        import openai
        import dotenv
        print("✅ Python模块导入测试通过")
        
        # 测试Node.js
        result = subprocess.run(['npm', 'run', 'build'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Node.js构建测试通过")
        else:
            print("⚠️  Node.js构建测试失败，但可能不影响开发")
        
        return True
    except ImportError as e:
        print(f"❌ Python模块导入测试失败：{e}")
        return False

def print_next_steps():
    """打印后续步骤"""
    print("\n" + "=" * 60)
    print("🎉 安装完成！")
    print("=" * 60)
    print("📋 后续步骤：")
    print("1. 编辑.env文件，设置你的DeepSeek API密钥（推荐）或OpenAI API密钥")
    print("2. 运行启动脚本：python start.py")
    print("3. 或者分别启动：")
    print("   - 后端：python app.py")
    print("   - 前端：npm run dev")
    print("\n🌐 访问地址：")
    print("   - 前端：http://localhost:8080")
    print("   - 后端：http://localhost:5000")
    print("\n📚 使用说明请查看README.md")
    print("=" * 60)

def main():
    """主函数"""
    print_banner()
    
    # 检查Python版本
    if not check_python_version():
        print("\n❌ Python版本检查失败，请升级Python后重试")
        return
    
    # 检查Node.js版本
    if not check_node_version():
        print("\n❌ Node.js检查失败，请先安装Node.js")
        print("推荐使用NVM安装：")
        print("curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash")
        print("nvm install 16")
        print("nvm use 16")
        return
    
    # 安装Python依赖
    if not install_python_dependencies():
        print("\n❌ Python依赖安装失败")
        return
    
    # 安装Node.js依赖
    if not install_node_dependencies():
        print("\n❌ Node.js依赖安装失败")
        return
    
    # 设置环境
    if not setup_environment():
        print("\n❌ 环境设置失败")
        return
    
    # 创建目录
    if not create_directories():
        print("\n❌ 目录创建失败")
        return
    
    # 测试安装
    if not test_installation():
        print("\n⚠️  安装测试失败，但可能不影响基本功能")
    
    # 打印后续步骤
    print_next_steps()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n🛑 安装被用户中断")
    except Exception as e:
        print(f"\n❌ 安装过程中发生错误：{e}")
        print("请检查错误信息并重试")
