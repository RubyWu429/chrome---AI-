// 飞书API测试脚本 - 找到正确的API端点
// 在Chrome扩展的控制台中运行此脚本

console.log('🧪 开始测试飞书API端点...');

// 测试各种可能的API端点
async function testAllAPIEndpoints() {
  try {
    const result = await chrome.storage.sync.get(['feishuAppId', 'feishuAppSecret', 'feishuTableUrl']);
    
    if (!result.feishuAppSecret) {
      console.error('❌ 请先配置飞书应用信息');
      return;
    }
    
    // 获取访问令牌
    console.log('🔑 获取访问令牌...');
    const tokenResponse = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_id: result.feishuAppId,
        app_secret: result.feishuAppSecret
      })
    });
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.tenant_access_token;
    console.log('✅ 访问令牌获取成功');
    
    // 从链接提取表格ID
    const tableInfo = extractTableIdFromUrl(result.feishuTableUrl);
    if (!tableInfo) {
      console.error('❌ 无法解析表格链接');
      return;
    }
    
    console.log('📋 表格信息:', tableInfo);
    
    // 测试各种可能的API端点
    const testEndpoints = [
      // 标准电子表格API
      `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${tableInfo.id}`,
      `https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/${tableInfo.id}`,
      `https://open.feishu.cn/open-apis/sheets/v1/spreadsheets/${tableInfo.id}`,
      
      // 尝试不同的路径格式
      `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${tableInfo.id}/sheets`,
      `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${tableInfo.id}/values`,
      
      // 尝试使用不同的域名
      `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${tableInfo.id}`,
      `https://open.larksuite.com/open-apis/sheets/v2/spreadsheets/${tableInfo.id}`,
      
      // 尝试其他可能的API
      `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${tableInfo.id}/properties`,
      `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${tableInfo.id}/metadata`,
      
      // 尝试获取应用信息
      `https://open.feishu.cn/open-apis/application/v6/apps/${result.feishuAppId}`,
      
      // 尝试获取工作台信息
      `https://open.feishu.cn/open-apis/contact/v3/scope`
    ];
    
    console.log('🔍 开始测试API端点...');
    
    for (let i = 0; i < testEndpoints.length; i++) {
      const endpoint = testEndpoints[i];
      console.log(`\n${i + 1}/${testEndpoints.length} 测试: ${endpoint}`);
      
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`  状态码: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`  ✅ 成功! 响应:`, data);
          
          // 如果是表格信息，尝试获取sheet列表
          if (endpoint.includes('/spreadsheets/') && !endpoint.includes('/values/')) {
            console.log('  📋 尝试获取sheet列表...');
            await testSheetEndpoints(accessToken, tableInfo.id, data);
          }
          
        } else {
          const errorText = await response.text();
          console.log(`  ❌ 失败: ${errorText}`);
        }
        
      } catch (error) {
        console.log(`  ❌ 异常: ${error.message}`);
      }
      
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 测试sheet相关的API端点
async function testSheetEndpoints(accessToken, tableId, tableData) {
  const sheetEndpoints = [
    `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${tableId}/sheets`,
    `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${tableId}/values/Sheet1!A:B`,
    `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${tableId}/values/A:B`,
    `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${tableId}/values/Sheet1`,
    `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${tableId}/values`
  ];
  
  for (let endpoint of sheetEndpoints) {
    console.log(`  🔗 测试sheet端点: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`    状态码: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`    ✅ 成功! 响应:`, data);
      } else {
        const errorText = await response.text();
        console.log(`    ❌ 失败: ${errorText}`);
      }
      
    } catch (error) {
      console.log(`    ❌ 异常: ${error.message}`);
    }
  }
}

// 从表格链接中提取表格ID
function extractTableIdFromUrl(tableUrl) {
  try {
    const url = new URL(tableUrl);
    
    if (url.hostname.includes('feishu.cn') || url.hostname.includes('larksuite.com')) {
      if (url.pathname.includes('/sheets/')) {
        const match = url.pathname.match(/\/sheets\/([^\/\?]+)/);
        if (match) {
          return { type: 'sheets', id: match[1] };
        }
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// 导出函数
window.apiTest = {
  testAll: testAllAPIEndpoints
};

console.log('✅ API测试脚本加载完成');
console.log('💡 使用方法: apiTest.testAll()');
