// 最终版本的background.js - 解决所有问题

console.log('🚀 AI摘要助手 - 最终版本已加载');

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  console.log('📋 正在创建右键菜单...');
  
  chrome.contextMenus.create({
    id: "summarizeAndAddToFeishu",
    title: "自动摘要并添加到飞书文档",
    contexts: ["selection"]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('❌ 创建右键菜单失败:', chrome.runtime.lastError);
    } else {
      console.log('✅ 右键菜单创建成功');
    }
  });
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log('🖱️ 右键菜单被点击:', info.menuItemId);
  
  if (info.menuItemId === "summarizeAndAddToFeishu") {
    console.log('📝 开始处理摘要请求...');
    
    const selectedText = info.selectionText;
    const pageUrl = tab.url;
    const pageTitle = tab.title;
    
    console.log('📄 选中的文本长度:', selectedText.length);
    console.log('🔗 页面URL:', pageUrl);
    console.log('📋 页面标题:', pageTitle);
    
    try {
      // 显示加载状态
      chrome.action.setBadgeText({ text: "处理中" });
      chrome.action.setBadgeBackgroundColor({ color: "#4285f4" });
      
      // 获取存储的API密钥
      const result = await chrome.storage.sync.get(['deepseekApiKey']);
      const apiKey = result.deepseekApiKey;
      
      console.log('🔑 DeepSeek API密钥状态:', !!apiKey);
      
      if (!apiKey) {
        console.log('❌ 未配置DeepSeek API密钥');
        // 使用简单的通知
        chrome.action.setBadgeText({ text: "错误" });
        chrome.action.setBadgeBackgroundColor({ color: "#ea4335" });
        setTimeout(() => {
          chrome.action.setBadgeText({ text: "" });
        }, 3000);
        return;
      }
      
      // 调用DeepSeek API生成摘要
      console.log('🤖 开始调用DeepSeek API生成摘要...');
      const summary = await generateSummaryWithDeepSeek(selectedText, apiKey);
      console.log('✅ 摘要生成成功，长度:', summary.length);
      
      // 显示结果并打开飞书文档
      console.log('📝 显示结果并打开飞书文档...');
      await showResultAndOpenFeishu(summary, pageUrl, pageTitle);
      
      // 显示成功状态
      chrome.action.setBadgeText({ text: "完成" });
      chrome.action.setBadgeBackgroundColor({ color: "#34a853" });
      
      setTimeout(() => {
        chrome.action.setBadgeText({ text: "" });
      }, 3000);
      
    } catch (error) {
      console.error('❌ 处理失败:', error);
      chrome.action.setBadgeText({ text: "错误" });
      chrome.action.setBadgeBackgroundColor({ color: "#ea4335" });
      setTimeout(() => {
        chrome.action.setBadgeText({ text: "" });
      }, 3000);
    }
  }
});

// DeepSeek API摘要生成函数
async function generateSummaryWithDeepSeek(text, apiKey) {
  console.log('🤖 调用DeepSeek API...');
  
  // 限制文本长度
  const maxLength = 4000;
  const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  
  // DeepSeek API端点
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
          role: "system",
          content: "你是一个专业的产品分析助手，专门帮助产品经理提取文章的核心观点和启发点。请从产品经理的角度分析文章内容，提取主要观点和启发点，并总结这篇文章对AI时代产品经理的启发意义。总结要包含：1）文章的核心观点；2）对产品经理的具体启发；3）在AI时代如何应用这些观点。总结长度控制在300-400字之间，使用中文回复，语言要专业且实用。"
        },
        {
          role: "user",
          content: `请对以下文本进行摘要：\n\n${truncatedText}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });
  
  console.log('📡 DeepSeek API响应状态:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`DeepSeek API错误: ${response.status} - ${errorData.error?.message || '未知错误'}`);
  }
  
  const data = await response.json();
  console.log('✅ DeepSeek API调用成功');
  
  return data.choices[0].message.content.trim();
}

// 显示结果并打开飞书文档
async function showResultAndOpenFeishu(summary, pageUrl, pageTitle) {
  console.log('📋 准备显示结果...');
  
  // 创建格式化的数据
  const formattedData = {
    摘要: summary,
    链接: pageUrl,
    标题: pageTitle,
    时间: new Date().toLocaleString('zh-CN')
  };
  
  // 打开飞书文档
  console.log('🔗 打开飞书文档页面...');
  const feishuApiUrl = "https://au3r81yqpl.feishu.cn/wiki/DqfMwN8PricflbkQTX6cHEHxnth";
  
  try {
    // 创建新标签页
    const newTab = await chrome.tabs.create({ url: feishuApiUrl });
    console.log('✅ 成功打开飞书文档页面');
    
    // 等待页面加载完成后注入摘要面板
    setTimeout(async () => {
      try {
        console.log('🔧 开始注入摘要面板...');
        await chrome.scripting.executeScript({
          target: { tabId: newTab.id },
          func: (data) => {
            console.log('🎨 正在创建摘要面板...');
            
            // 检查是否已经存在面板
            const existingPanel = document.getElementById('ai-summary-panel');
            if (existingPanel) {
              existingPanel.remove();
            }
            
            // 创建摘要面板
            const div = document.createElement('div');
            div.id = 'ai-summary-panel';
            div.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              width: 400px;
              max-height: 80vh;
              background: white;
              border: 2px solid #4285f4;
              border-radius: 10px;
              padding: 20px;
              z-index: 10000;
              box-shadow: 0 4px 20px rgba(0,0,0,0.3);
              font-family: Arial, sans-serif;
              overflow-y: auto;
            `;
            
            div.innerHTML = `
              <h3 style="margin: 0 0 15px 0; color: #4285f4;">🎯 产品经理分析助手</h3>
              <div style="margin-bottom: 15px;">
                <strong>产品分析：</strong><br>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 5px; line-height: 1.5;">
                  ${data.摘要}
                </div>
              </div>
              <div style="margin-bottom: 15px;">
                <strong>链接：</strong><br>
                <a href="${data.链接}" target="_blank" style="color: #4285f4; word-break: break-all;">
                  ${data.链接}
                </a>
              </div>
              <div style="margin-bottom: 15px;">
                <strong>标题：</strong><br>
                <div style="word-break: break-all;">${data.标题}</div>
              </div>
              <div style="margin-bottom: 20px;">
                <strong>时间：</strong><br>
                ${data.时间}
              </div>
              <div style="margin-bottom: 15px;">
                <strong>完整内容（可手动复制）：</strong><br>
                <textarea readonly style="
                  width: 100%;
                  height: 100px;
                  padding: 10px;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                  font-family: monospace;
                  font-size: 12px;
                  resize: vertical;
                  background: #f8f9fa;
                ">产品分析：${data.摘要}

原文链接：${data.链接}

文章标题：${data.标题}

分析时间：${data.时间}</textarea>
              </div>
              <button onclick="copyToClipboard()" style="
                background: #4285f4;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-right: 10px;
              ">复制到剪贴板</button>
              <button onclick="closePanel()" style="
                background: #ea4335;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
              ">关闭</button>
            `;
            
            // 添加关闭功能
            window.closePanel = function() {
              const panel = document.getElementById('ai-summary-panel');
              if (panel) {
                panel.remove();
                console.log('✅ 摘要面板已关闭');
              }
            };
            
            // 添加复制功能
            window.copyToClipboard = function() {
              const text = `产品分析：${data.摘要}\n\n原文链接：${data.链接}\n\n文章标题：${data.标题}\n\n分析时间：${data.时间}`;
              
              // 方法1：尝试使用现代Clipboard API
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                  showCopySuccess();
                }).catch((err) => {
                  console.log('Clipboard API失败，使用备用方法:', err);
                  fallbackCopy();
                });
              } else {
                // 方法2：使用传统方法
                fallbackCopy();
              }
              
              function fallbackCopy() {
                try {
                  // 创建临时文本区域
                  const textArea = document.createElement('textarea');
                  textArea.value = text;
                  textArea.style.position = 'fixed';
                  textArea.style.left = '-999999px';
                  textArea.style.top = '-999999px';
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();
                  
                  // 执行复制命令
                  const successful = document.execCommand('copy');
                  document.body.removeChild(textArea);
                  
                  if (successful) {
                    showCopySuccess();
                  } else {
                    showCopyError();
                  }
                } catch (err) {
                  console.error('复制失败:', err);
                  showCopyError();
                }
              }
              
              function showCopySuccess() {
                // 创建成功提示
                const successDiv = document.createElement('div');
                successDiv.style.cssText = `
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  background: #34a853;
                  color: white;
                  padding: 15px 25px;
                  border-radius: 8px;
                  font-size: 16px;
                  z-index: 10001;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                `;
                successDiv.textContent = '✅ 已复制到剪贴板！';
                document.body.appendChild(successDiv);
                
                // 3秒后自动移除
                setTimeout(() => {
                  if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                  }
                }, 3000);
              }
              
              function showCopyError() {
                // 创建错误提示
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  background: #ea4335;
                  color: white;
                  padding: 15px 25px;
                  border-radius: 8px;
                  font-size: 16px;
                  z-index: 10001;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                `;
                errorDiv.textContent = '❌ 复制失败，请手动复制';
                document.body.appendChild(errorDiv);
                
                // 3秒后自动移除
                setTimeout(() => {
                  if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                  }
                }, 3000);
              }
            };
            
            document.body.appendChild(div);
            console.log('✅ 摘要面板已创建');
            
            // 添加ESC键关闭功能
            const handleKeyPress = function(event) {
              if (event.key === 'Escape') {
                closePanel();
                document.removeEventListener('keydown', handleKeyPress);
              }
            };
            document.addEventListener('keydown', handleKeyPress);
            
            // 添加点击外部区域关闭功能
            const handleClickOutside = function(event) {
              if (!div.contains(event.target)) {
                closePanel();
                document.removeEventListener('click', handleClickOutside);
              }
            };
            // 延迟添加点击外部关闭，避免立即触发
            setTimeout(() => {
              document.addEventListener('click', handleClickOutside);
            }, 100);
          },
          args: [formattedData]
        });
        console.log('✅ 成功注入摘要面板');
      } catch (e) {
        console.error('❌ 注入摘要面板失败:', e);
      }
    }, 3000); // 等待3秒让页面加载
    
  } catch (error) {
    console.error('❌ 打开飞书文档页面失败:', error);
    // 备用方案：使用window.open
    window.open(feishuApiUrl, '_blank');
  }
} 