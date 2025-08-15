#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
墨香铜臭风格小说生成器 - 启动脚本
"""

import os
import subprocess
import sys
import time

def print_banner():
    """打印启动横幅"""
    print("=" * 60)
    print("🎭 AI小说风格学习生成器")
    print("=" * 60)
    print("✨ 基于LLM API的智能小说生成系统")
    print("📚 支持任意TXT文件风格学习，包括墨香铜臭等作家作品")
    print("=" * 60)

def check_dependencies():
    """检查依赖是否安装"""
    print("🔍 检查依赖包...")
    
    required_packages = ['flask', 'openai', 'python-dotenv', 'flask-cors', 'requests']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - 未安装")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️  缺少依赖包：{', '.join(missing_packages)}")
        print("请运行以下命令安装：")
        print(f"pip install {' '.join(missing_packages)}")
        return False
    
    print("✅ 所有依赖包已安装")
    return True

def check_env_file():
    """检查环境变量文件"""
    print("\n🔧 检查环境配置...")
    
    if not os.path.exists('.env'):
        print("⚠️  未找到.env文件")
        print("请复制env.example为.env并设置你的OpenAI API密钥")
        print("cp env.example .env")
        print("然后编辑.env文件，填入你的OPENAI_API_KEY")
        return False
    
    # 检查API密钥
    with open('.env', 'r') as f:
        content = f.read()
        if 'OPENAI_API_KEY=your_openai_api_key_here' in content:
            print("⚠️  请在.env文件中设置你的OpenAI API密钥")
            return False
    
    print("✅ 环境配置检查通过")
    return True

def start_backend():
    """启动后端服务"""
    print("\n🚀 启动后端服务...")
    print("📱 后端地址：http://localhost:5000")
    print("⏹️  按 Ctrl+C 停止服务")
    print("-" * 60)
    
    try:
        subprocess.run([sys.executable, "app.py"])
    except KeyboardInterrupt:
        print("\n\n🛑 后端服务已停止")
    except Exception as e:
        print(f"❌ 启动后端服务失败：{e}")

def start_frontend():
    """启动前端服务"""
    print("\n🌐 启动前端服务...")
    print("📱 前端地址：http://localhost:8080")
    print("⏹️  按 Ctrl+C 停止服务")
    print("-" * 60)
    
    try:
        subprocess.run(["npm", "run", "dev"])
    except KeyboardInterrupt:
        print("\n\n🛑 前端服务已停止")
    except Exception as e:
        print(f"❌ 启动前端服务失败：{e}")

def main():
    """主函数"""
    print_banner()
    
    # 检查依赖
    if not check_dependencies():
        print("\n❌ 依赖检查失败，请先安装所需包")
        return
    
    # 检查环境配置
    if not check_env_file():
        print("\n❌ 环境配置检查失败")
        return
    
    print("\n🎉 系统检查完成！")
    print("\n请选择操作：")
    print("1. 启动后端服务（推荐先启动）")
    print("2. 启动前端服务")
    print("3. 同时启动前后端")
    print("4. 退出")
    
    while True:
        try:
            choice = input("\n请输入选择 (1/2/3/4): ").strip()
            
            if choice == "1":
                start_backend()
                break
            elif choice == "2":
                start_frontend()
                break
            elif choice == "3":
                print("\n🔄 同时启动前后端服务...")
                print("后端：http://localhost:5000")
                print("前端：http://localhost:8080")
                print("请打开两个终端窗口分别运行")
                break
            elif choice == "4":
                print("👋 再见！")
                break
            else:
                print("❌ 无效选择，请输入 1、2、3 或 4")
        except KeyboardInterrupt:
            print("\n\n👋 再见！")
            break

if __name__ == "__main__":
    main()
