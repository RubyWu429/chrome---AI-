// 弹出窗口的JavaScript逻辑
document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const feishuAppIdInput = document.getElementById('feishuAppId');
  const feishuAppSecretInput = document.getElementById('feishuAppSecret');
  const feishuTableUrlInput = document.getElementById('feishuTableUrl');
  const templateSelect = document.getElementById('templateSelect');
  const saveBtn = document.getElementById('saveBtn');
  const testBtn = document.getElementById('testBtn');
  const statusDiv = document.getElementById('status');
  
  // 加载保存的配置
  chrome.storage.sync.get(['deepseekApiKey', 'feishuAppId', 'feishuAppSecret', 'feishuTableUrl', 'defaultTemplate'], function(result) {
    if (result.deepseekApiKey) {
      apiKeyInput.value = result.deepseekApiKey;
    }
    if (result.feishuAppId) {
      feishuAppIdInput.value = result.feishuAppId;
    }
    if (result.feishuAppSecret) {
      feishuAppSecretInput.value = result.feishuAppSecret;
    }
    if (result.feishuTableUrl) {
      feishuTableUrlInput.value = result.feishuTableUrl;
    }
    if (result.defaultTemplate) {
      templateSelect.value = result.defaultTemplate;
    }
  });
  
  // 保存按钮点击事件
  saveBtn.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    const feishuAppId = feishuAppIdInput.value.trim();
    const feishuAppSecret = feishuAppSecretInput.value.trim();
    const feishuTableUrl = feishuTableUrlInput.value.trim();
    const selectedTemplate = templateSelect.value;
    
    if (!apiKey) {
      showStatus('请输入DeepSeek API密钥', 'error');
      return;
    }
    
    if (!feishuAppId || !feishuAppSecret) {
      showStatus('请输入飞书应用的App ID和App Secret', 'error');
      return;
    }
    
    if (!feishuTableUrl) {
      showStatus('请输入飞书表格链接', 'error');
      return;
    }
    
    // 保存所有配置
    chrome.storage.sync.set({
      deepseekApiKey: apiKey,
      feishuAppId: feishuAppId,
      feishuAppSecret: feishuAppSecret,
      feishuTableUrl: feishuTableUrl,
      defaultTemplate: selectedTemplate
    }, function() {
      showStatus('设置已保存！', 'success');
      
      // 3秒后隐藏状态消息
      setTimeout(() => {
        hideStatus();
      }, 3000);
    });
  });
  
  // 显示状态消息
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
  }
  
  // 隐藏状态消息
  function hideStatus() {
    statusDiv.style.display = 'none';
  }
  
  // 测试飞书连接按钮
  testBtn.addEventListener('click', async function() {
    const feishuAppId = feishuAppIdInput.value.trim();
    const feishuAppSecret = feishuAppSecretInput.value.trim();
    
    if (!feishuAppId || !feishuAppSecret) {
      showStatus('请先输入飞书应用的App ID和App Secret', 'error');
      return;
    }
    
    showStatus('正在测试连接...', 'success');
    
    try {
      // 临时保存配置用于测试
      await new Promise((resolve) => {
        chrome.storage.sync.set({
          feishuAppId: feishuAppId,
          feishuAppSecret: feishuAppSecret
        }, resolve);
      });
      
      // 测试连接
      const feishuAPI = new FeishuAPI();
      const result = await feishuAPI.testConnection();
      
      if (result.success) {
        showStatus(result.message, 'success');
      } else {
        showStatus(result.message, 'error');
      }
      
    } catch (error) {
      showStatus('测试失败: ' + error.message, 'error');
    }
  });
  
  // 回车键保存
  apiKeyInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  });
}); 