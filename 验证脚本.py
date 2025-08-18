#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI摘要助手增强版 - 验证脚本
"""

import os
import json
import re

def print_banner():
    """打印验证横幅"""
    print("=" * 60)
    print("🔍 AI摘要助手增强版 - 功能验证脚本")
    print("=" * 60)
    print()

def check_manifest():
    """检查manifest.json文件"""
    print("📋 检查manifest.json...")
    
    try:
        with open("manifest.json", "r", encoding="utf-8") as f:
            manifest = json.load(f)
        
        # 检查必要字段
        required_fields = [
            "manifest_version", "name", "version", "description",
            "permissions", "host_permissions", "background", "action"
        ]
        
        for field in required_fields:
            if field not in manifest:
                print(f"❌ 缺少必要字段: {field}")
                return False
        
        # 检查版本
        if manifest["version"] != "2.0":
            print(f"❌ 版本号不正确: {manifest['version']}")
            return False
        
        # 检查background脚本
        if manifest["background"]["service_worker"] != "background-enhanced.js":
            print(f"❌ background脚本配置错误: {manifest['background']['service_worker']}")
            return False
        
        print("✅ manifest.json验证通过")
        return True
        
    except Exception as e:
        print(f"❌ manifest.json验证失败: {e}")
        return False

def check_js_syntax():
    """检查JavaScript文件语法"""
    print("🔧 检查JavaScript文件语法...")
    
    js_files = [
        "background-enhanced.js",
        "popup.js", 
        "content.js",
        "feishu-api-enhanced.js"
    ]
    
    for file in js_files:
        if not os.path.exists(file):
            print(f"❌ 文件不存在: {file}")
            continue
            
        try:
            with open(file, "r", encoding="utf-8") as f:
                content = f.read()
            
            # 检查基本语法
            if "function" in content or "const" in content or "let" in content:
                print(f"✅ {file} 语法检查通过")
            else:
                print(f"⚠️ {file} 可能存在问题")
                
        except Exception as e:
            print(f"❌ {file} 读取失败: {e}")
    
    return True

def check_html_structure():
    """检查HTML文件结构"""
    print("🌐 检查HTML文件结构...")
    
    try:
        with open("popup.html", "r", encoding="utf-8") as f:
            content = f.read()
        
        # 检查必要元素
        required_elements = [
            "apiKey", "feishuAppId", "feishuAppSecret",
            "category", "templateSelect", "saveBtn"
        ]
        
        for element in required_elements:
            if element not in content:
                print(f"❌ 缺少必要元素: {element}")
                return False
        
        print("✅ popup.html结构检查通过")
        return True
        
    except Exception as e:
        print(f"❌ HTML检查失败: {e}")
        return False

def check_icons():
    """检查图标文件"""
    print("🖼️ 检查图标文件...")
    
    icon_files = ["icon16.png", "icon48.png", "icon128.png"]
    
    for icon in icon_files:
        icon_path = os.path.join("icons", icon)
        if os.path.exists(icon_path):
            size = os.path.getsize(icon_path)
            if size > 100:  # 图标文件应该大于100字节
                print(f"✅ {icon} 正常 ({size} bytes)")
            else:
                print(f"⚠️ {icon} 可能损坏 ({size} bytes)")
        else:
            print(f"❌ 图标文件不存在: {icon}")
    
    return True

def check_features():
    """检查功能特性"""
    print("🚀 检查功能特性...")
    
    # 检查摘要模板
    try:
        with open("background-enhanced.js", "r", encoding="utf-8") as f:
            content = f.read()
        
        templates = ["通用模板", "Claude CEO框架", "Anthropic CPO框架", "Peter Deng框架"]
        for template in templates:
            if template in content:
                print(f"✅ 摘要模板: {template}")
            else:
                print(f"❌ 缺少摘要模板: {template}")
        
        # 检查分类功能
        categories = ["产品类", "技术类", "趋势类"]
        for category in categories:
            if category in content:
                print(f"✅ 文章分类: {category}")
            else:
                print(f"❌ 缺少文章分类: {category}")
        
        # 检查飞书API集成
        if "addToFeishuTable" in content:
            print("✅ 飞书表格集成")
        else:
            print("❌ 缺少飞书表格集成")
            
    except Exception as e:
        print(f"❌ 功能检查失败: {e}")
        return False
    
    return True

def check_documentation():
    """检查文档完整性"""
    print("📚 检查文档完整性...")
    
    required_docs = [
        "README-增强版.md",
        "使用指南-增强版.md", 
        "安装完成指南.md"
    ]
    
    for doc in required_docs:
        if os.path.exists(doc):
            size = os.path.getsize(doc)
            if size > 1000:  # 文档应该大于1KB
                print(f"✅ {doc} 完整 ({size} bytes)")
            else:
                print(f"⚠️ {doc} 可能不完整 ({size} bytes)")
        else:
            print(f"❌ 文档不存在: {doc}")
    
    return True

def main():
    """主验证函数"""
    print_banner()
    
    checks = [
        check_manifest,
        check_js_syntax,
        check_html_structure,
        check_icons,
        check_features,
        check_documentation
    ]
    
    passed = 0
    total = len(checks)
    
    for check in checks:
        try:
            if check():
                passed += 1
            print()
        except Exception as e:
            print(f"❌ 验证过程出错: {e}")
            print()
    
    # 输出验证结果
    print("=" * 60)
    print(f"🎯 验证完成: {passed}/{total} 项检查通过")
    print("=" * 60)
    
    if passed == total:
        print("🎉 恭喜！所有检查都通过了，插件可以正常使用！")
        print("\n📋 下一步操作：")
        print("1. 在Chrome中加载插件")
        print("2. 配置API密钥和飞书应用")
        print("3. 开始使用增强功能")
    else:
        print("⚠️ 部分检查未通过，请修复上述问题后重试")
    
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️ 验证被用户中断")
    except Exception as e:
        print(f"\n\n❌ 验证过程中发生错误: {e}")
        print("请检查错误信息并重试")
