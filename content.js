// 内容脚本 - 用于与页面交互
console.log("AI摘要助手已加载");

// 监听来自background script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    const selectedText = window.getSelection().toString();
    sendResponse({ text: selectedText });
  }
});

// 获取页面标题和URL的辅助函数
function getPageInfo() {
  return {
    title: document.title,
    url: window.location.href,
    selectedText: window.getSelection().toString()
  };
}

// 暴露给background script使用
window.getPageInfo = getPageInfo; 