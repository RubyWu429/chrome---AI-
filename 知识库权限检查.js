// 飞书知识库权限检查脚本
// 在Chrome扩展的控制台中运行此脚本

console.log('🔍 开始检查飞书知识库权限...');

// 检查知识库访问权限
async function checkWikiPermissions() {
  try {
    const result = await chrome.storage.sync.get(['feishuAppId', 'feishuAppSecret', 'feishuTableId']);
    
    if (!result.feishuAppId || !result.feishuAppSecret) {
      console.error('❌ 请先配置飞书应用信息');
      return;
    }
    
    console.log('📱 App ID:', result.feishuAppId);
    console.log('🔑 App Secret:', result.feishuAppSecret ? '已配置' : '未配置');
    console.log('📋 表格ID:', result.feishuTableId || '未配置');
    
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
    
    if (!tokenResponse.ok) {
      console.error('❌ 获取访问令牌失败:', tokenResponse.status);
      return;
    }
    
    const tokenData = await tokenResponse.json();
    if (tokenData.code !== 0) {
      console.error('❌ 飞书API错误:', tokenData.msg);
      return;
    }
    
    const accessToken = tokenData.tenant_access_token;
    console.log('✅ 成功获取访问令牌');
    
    // 测试知识库API
    if (result.feishuTableId) {
      console.log('🔗 测试知识库表格API...');
      
      const wikiEndpoints = [
        `https://open.feishu.cn/open-apis/wiki/v2/spaces/${result.feishuTableId}/tables`,
        `https://open.feishu.cn/open-apis/wiki/v2/spaces/${result.feishuTableId}`,
        `https://open.feishu.cn/open-apis/wiki/v2/spaces/${result.feishuTableId}/tables/records`
      ];
      
      for (let endpoint of wikiEndpoints) {
        console.log(`📡 测试端点: ${endpoint}`);
        
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
            console.log(`  ✅ 成功:`, data);
          } else {
            const errorText = await response.text();
            console.log(`  ❌ 失败: ${errorText}`);
          }
          
        } catch (error) {
          console.log(`  ❌ 异常: ${error.message}`);
        }
      }
    }
    
    // 检查应用权限
    console.log('🔐 检查应用权限...');
    
    const permissionEndpoints = [
      'https://open.feishu.cn/open-apis/application/v6/apps/' + result.feishuAppId,
      'https://open.feishu.cn/open-apis/contact/v3/scope'
    ];
    
    for (let endpoint of permissionEndpoints) {
      console.log(`📡 检查权限: ${endpoint}`);
      
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
          console.log(`  ✅ 成功:`, data);
        } else {
          const errorText = await response.text();
          console.log(`  ❌ 失败: ${errorText}`);
        }
        
      } catch (error) {
        console.log(`  ❌ 异常: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
}

// 测试添加记录到知识库
async function testAddRecordToWiki() {
  try {
    const result = await chrome.storage.sync.get(['feishuAppId', 'feishuAppSecret', 'feishuTableId']);
    
    if (!result.feishuTableId) {
      console.error('❌ 请先配置表格ID');
      return;
    }
    
    console.log('🧪 测试添加记录到知识库...');
    
    // 获取访问令牌
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
    
    // 测试数据
    const testData = {
      fields: {
        '原文信息': '测试链接：https://example.com\n\n测试标题：这是一个测试\n\n分析时间：2025/1/29 测试',
        '文章总结': '这是一个测试摘要，用于验证知识库API是否正常工作。'
      }
    };
    
    // 尝试添加测试记录
    const response = await fetch(`https://open.feishu.cn/open-apis/wiki/v2/spaces/${result.feishuTableId}/tables/records`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📡 添加记录响应状态:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 测试记录添加成功:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ 测试记录添加失败:', errorText);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 导出函数
window.wikiCheck = {
  checkPermissions: checkWikiPermissions,
  testAddRecord: testAddRecordToWiki
};

console.log('✅ 知识库权限检查脚本加载完成');
console.log('💡 使用方法:');
console.log('- 检查权限: wikiCheck.checkPermissions()');
console.log('- 测试添加记录: wikiCheck.testAddRecord()');
