# DeepSeek API使用指南

## 🎯 关于DeepSeek API

DeepSeek是一个强大的AI模型服务，提供类似OpenAI的API接口。我们的扩展现在已经更新为支持DeepSeek API。

## 🔑 获取DeepSeek API密钥

### 步骤1：注册DeepSeek账户
1. 访问 [DeepSeek官网](https://www.deepseek.com/)
2. 注册或登录账户

### 步骤2：获取API密钥
1. 登录后进入API管理页面
2. 创建新的API密钥
3. 复制并保存API密钥（注意：密钥只显示一次！）

## ⚙️ 配置扩展

### 1. 更新扩展
- 扩展已经更新为支持DeepSeek API
- 重新加载扩展以应用更改

### 2. 配置API密钥
1. 点击扩展图标打开设置
2. 在"DeepSeek API密钥"字段输入你的API密钥
3. 点击"保存设置"

## 🧪 测试API连接

### 方法1：使用测试脚本
1. 打开任意网页
2. 按F12打开开发者工具
3. 切换到"控制台"标签
4. 复制并粘贴以下代码：

```javascript
// 测试DeepSeek API
async function testDeepSeek() {
    const apiKey = 'your-api-key-here'; // 替换为你的API密钥
    
    try {
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "user",
                        content: "请简单回复'测试成功'"
                    }
                ],
                max_tokens: 50
            })
        });
        
        const data = await response.json();
        console.log('✅ 测试成功:', data.choices[0].message.content);
    } catch (error) {
        console.error('❌ 测试失败:', error);
    }
}

testDeepSeek();
```

### 方法2：使用扩展功能
1. 打开 `test.html` 文件
2. 选择一些文本
3. 右键点击选择"自动摘要并添加到飞书文档"
4. 查看控制台输出

## 🔧 故障排除

### 常见问题

1. **API密钥错误**
   - 确保API密钥格式正确
   - 检查API密钥是否有效
   - 确认账户有足够的余额

2. **网络连接问题**
   - 检查网络连接
   - 确认可以访问 `api.deepseek.com`

3. **模型名称错误**
   - DeepSeek使用的模型名称是 `deepseek-chat`
   - 确保API请求中使用正确的模型名称

### 调试步骤

1. **查看控制台日志**
   - 按F12打开开发者工具
   - 查看控制台中的调试信息
   - 查找以"🚀"、"🤖"、"✅"开头的日志

2. **检查API响应**
   - 查看网络请求的响应状态
   - 检查API返回的错误信息

3. **验证配置**
   - 确认API密钥已正确保存
   - 检查扩展权限设置

## 💡 使用技巧

### 优化摘要质量
- DeepSeek对中文支持很好
- 可以调整temperature参数控制创造性
- 使用system prompt指导模型行为

### 节省API费用
- 合理设置max_tokens参数
- 避免重复调用相同内容
- 监控API使用量

## 📊 DeepSeek vs OpenAI

| 特性 | DeepSeek | OpenAI |
|------|----------|--------|
| 中文支持 | 优秀 | 良好 |
| 价格 | 相对便宜 | 较贵 |
| 响应速度 | 快 | 中等 |
| 模型质量 | 高 | 很高 |

## 🚀 开始使用

现在你可以：

1. **配置DeepSeek API密钥**
2. **重新加载扩展**
3. **在任意网页上选择文本**
4. **右键点击选择"自动摘要并添加到飞书文档"**
5. **享受AI摘要功能！**

---

**注意**：使用DeepSeek API会产生相应的费用，请合理使用并监控API使用量。 