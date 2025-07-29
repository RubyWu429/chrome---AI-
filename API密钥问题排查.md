# DeepSeek API密钥问题排查指南

## 🔍 401 Unauthorized 错误排查

### 1. 检查API密钥格式

**正确的格式**：
- 以 `sk-` 开头
- 长度通常在40-50个字符
- 例如：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**常见错误**：
- ❌ 缺少 `sk-` 前缀
- ❌ 密钥太短（少于20个字符）
- ❌ 包含空格或特殊字符
- ❌ 复制时包含了额外的字符

### 2. 检查API密钥来源

**确认步骤**：
1. 登录 [DeepSeek官网](https://www.deepseek.com/)
2. 进入API管理页面
3. 确认密钥状态为"有效"
4. 检查密钥是否有使用限制

### 3. 检查账户状态

**可能的问题**：
- 账户未激活
- 账户余额不足
- 账户被暂停
- 需要验证邮箱

### 4. 检查网络和权限

**网络问题**：
- 确认可以访问 `api.deepseek.com`
- 检查防火墙设置
- 确认没有代理限制

**权限问题**：
- 确认API密钥有正确的权限
- 检查是否有IP白名单限制

## 🛠️ 快速诊断步骤

### 步骤1：验证API密钥格式

```javascript
// 在控制台中运行
function checkApiKey(apiKey) {
    console.log('🔍 检查API密钥格式...');
    console.log('密钥长度:', apiKey.length);
    console.log('是否以sk-开头:', apiKey.startsWith('sk-'));
    console.log('密钥前10个字符:', apiKey.substring(0, 10));
    
    if (!apiKey.startsWith('sk-')) {
        console.log('❌ 错误: API密钥应该以"sk-"开头');
        return false;
    }
    
    if (apiKey.length < 40) {
        console.log('❌ 错误: API密钥太短');
        return false;
    }
    
    console.log('✅ API密钥格式正确');
    return true;
}

// 使用方法
checkApiKey('your-api-key-here');
```

### 步骤2：测试API连接

```javascript
// 使用改进的测试脚本
async function quickTest(apiKey) {
    if (!checkApiKey(apiKey)) {
        return;
    }
    
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
                        content: "测试"
                    }
                ],
                max_tokens: 10
            })
        });
        
        console.log('状态码:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ 成功:', data.choices[0].message.content);
        } else {
            const error = await response.text();
            console.log('❌ 失败:', error);
        }
    } catch (error) {
        console.log('❌ 网络错误:', error.message);
    }
}

// 使用方法
quickTest('your-api-key-here');
```

## 🔧 常见解决方案

### 方案1：重新生成API密钥

1. 登录DeepSeek账户
2. 删除旧的API密钥
3. 创建新的API密钥
4. 复制新密钥（注意不要包含空格）

### 方案2：检查账户设置

1. 确认账户已激活
2. 检查账户余额
3. 确认邮箱已验证
4. 检查账户状态

### 方案3：联系DeepSeek支持

如果以上步骤都无法解决问题：
1. 访问DeepSeek支持页面
2. 提供详细的错误信息
3. 包含API密钥格式（隐藏部分字符）
4. 提供测试时间戳

## 📋 检查清单

- [ ] API密钥以 `sk-` 开头
- [ ] API密钥长度足够（40+字符）
- [ ] 没有多余的空格或字符
- [ ] 账户已激活
- [ ] 账户有足够余额
- [ ] 网络连接正常
- [ ] 可以访问 api.deepseek.com
- [ ] 没有防火墙限制

## 🚨 安全提醒

1. **不要分享API密钥**：API密钥是敏感信息，不要分享给他人
2. **不要在公开场合显示**：在截图或日志中隐藏部分字符
3. **定期更换密钥**：建议定期更换API密钥
4. **监控使用量**：定期检查API使用情况

## 💡 调试技巧

1. **使用浏览器开发者工具**：
   - 按F12打开开发者工具
   - 查看Network标签页
   - 检查API请求的详细信息

2. **查看完整错误信息**：
   - 不要只看状态码
   - 查看完整的错误响应
   - 注意错误消息中的具体提示

3. **逐步测试**：
   - 先测试最简单的请求
   - 逐步增加复杂度
   - 记录每一步的结果

---

**如果问题仍然存在，请提供以下信息**：
- API密钥格式（隐藏部分字符）
- 完整的错误信息
- 测试时间
- 浏览器和操作系统版本 