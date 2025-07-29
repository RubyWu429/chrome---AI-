# 🎯 AI产品经理分析助手

一个专为产品经理设计的Chrome扩展，能够自动分析文章内容并提取对产品经理有价值的观点和启发点，特别适合面试准备。

## ✨ 功能特点

- 🤖 **AI智能分析**：使用DeepSeek API对文章进行深度分析
- 🎯 **产品经理视角**：专门从产品经理角度提取核心观点和启发点
- 📋 **一键复制**：自动生成格式化的分析内容，方便复制到飞书文档
- 🚀 **快速部署**：简单的安装和配置过程
- 💡 **面试助手**：为产品经理面试提供专业的内容分析

## 🛠️ 技术栈

- **Chrome Extension Manifest V3**
- **DeepSeek API** - AI分析引擎
- **JavaScript ES6+**
- **Chrome APIs** - 扩展开发

## 📦 安装步骤

### 1. 下载项目
```bash
git clone https://github.com/你的用户名/ai-product-manager-assistant.git
cd ai-product-manager-assistant
```

### 2. 配置API密钥
1. 获取DeepSeek API密钥：访问 [DeepSeek官网](https://platform.deepseek.com/)
2. 打开Chrome扩展管理页面：`chrome://extensions/`
3. 点击"AI产品经理分析助手"的"选项"
4. 输入你的DeepSeek API密钥并保存

### 3. 安装扩展
1. 在Chrome扩展管理页面启用"开发者模式"
2. 点击"加载已解压的扩展程序"
3. 选择项目文件夹
4. 扩展安装完成！

## 🎯 使用方法

1. **选择文本**：在任何网页上选择要分析的文章内容
2. **右键菜单**：右键点击选中的文本
3. **选择功能**：点击"自动摘要并添加到飞书文档"
4. **查看结果**：等待AI分析完成，查看生成的产品分析
5. **复制内容**：点击"复制到剪贴板"或手动复制文本框内容

## 📁 项目结构

```
ai-product-manager-assistant/
├── manifest.json          # 扩展配置文件
├── background.js          # 后台脚本（主要逻辑）
├── content.js             # 内容脚本
├── popup.html             # 弹出窗口界面
├── popup.js               # 弹出窗口逻辑
├── feishu-api.js          # 飞书API集成
├── icons/                 # 扩展图标
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # 项目说明
```

## 🔧 配置说明

### DeepSeek API配置
- 模型：`deepseek-chat`
- 最大token：500
- 温度：0.7
- 分析长度：300-400字

### 分析内容结构
1. **核心观点**：提取文章的主要论点
2. **产品启发**：对产品经理的具体启发
3. **AI时代应用**：在AI时代如何应用这些观点

## 🚀 开发指南

### 本地开发
1. 克隆项目到本地
2. 在Chrome中加载扩展
3. 修改代码后重新加载扩展
4. 查看控制台日志进行调试

### 调试技巧
- 打开Chrome开发者工具
- 查看Console标签页的日志输出
- 使用`chrome://extensions/`页面重新加载扩展

## 📝 更新日志

### v1.0.0 (2024-01-XX)
- ✨ 初始版本发布
- 🎯 专为产品经理优化的AI分析
- 📋 一键复制功能
- 🚀 完整的Chrome扩展功能

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork项目
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交Pull Request

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [DeepSeek](https://platform.deepseek.com/) - 提供强大的AI分析能力
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/) - 扩展开发平台
- 所有为项目做出贡献的开发者

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至：[你的邮箱]

---

⭐ 如果这个项目对你有帮助，请给它一个星标！ 