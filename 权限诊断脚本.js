// 飞书权限诊断脚本 - 帮助排查API权限问题
// 在Chrome扩展的控制台中运行此脚本

console.log('🔍 开始飞书权限诊断...');

// 测试基础权限
async function testBasicPermissions() {
  console.log('📋 测试基础权限...');
  
  try {
    const result = await chrome.storage.sync.get(['feishuAppId', 'feishuAppSecret']);
    
    if (!result.feishuAppId || !result.feishuAppSecret) {
      console.error('❌ 配置不完整');
      return false;
    }
    
    console.log('✅ 配置完整');
    console.log('App ID:', result.feishuAppId);
    console.log('App Secret:', result.feishuAppSecret ? '已配置' : '未配置');
    
    return true;
  } catch (error) {
    console.error('❌ 读取配置失败:', error);
    return false;
  }
}

// 测试访问令牌获取
async function testAccessToken() {
  console.log('🔑 测试访问令牌获取...');
  
  try {
    const result = await chrome.storage.sync.get(['feishuAppId', 'feishuAppSecret']);
    
    const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_id: result.feishuAppId,
        app_secret: result.feishuAppSecret
      })
    });
    
    console.log('📡 响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 获取令牌失败:', errorText);
      return null;
    }
    
    const data = await response.json();
    console.log('📄 响应数据:', data);
    
    if (data.code === 0) {
      console.log('✅ 成功获取访问令牌');
      return data.tenant_access_token;
    } else {
      console.error('❌ 飞书API错误:', data.msg);
      return null;
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    return null;
  }
}

// 测试应用信息获取
async function testAppInfo(accessToken) {
  console.log('📱 测试应用信息获取...');
  
  try {
    const result = await chrome.storage.sync.get(['feishuAppId']);
    
    // 尝试获取应用信息
    const response = await fetch(`https://open.feishu.cn/open-apis/application/v6/apps/${result.feishuAppId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 应用信息响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 获取应用信息失败:', errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('📄 应用信息:', data);
    
    if (data.code === 0) {
      console.log('✅ 成功获取应用信息');
      return true;
    } else {
      console.error('❌ 应用信息API错误:', data.msg);
      return false;
    }
    
  } catch (error) {
    console.error('❌ 测试应用信息失败:', error);
    return false;
  }
}

// 测试表格权限
async function testSheetsPermission(accessToken) {
  console.log('📊 测试表格权限...');
  
  try {
    // 尝试获取表格列表
    const response = await fetch('https://open.feishu.cn/open-apis/sheets/v2/spreadsheets', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 表格权限响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 获取表格列表失败:', errorText);
      
      // 尝试解析错误信息
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.code === 10003) {
          console.error('❌ 权限不足，需要添加表格相关权限');
        } else if (errorData.code === 10004) {
          console.error('❌ 应用未启用或未发布');
        }
      } catch (e) {
        console.error('❌ 未知错误');
      }
      
      return false;
    }
    
    const data = await response.json();
    console.log('📄 表格列表响应:', data);
    
    if (data.code === 0) {
      console.log('✅ 成功获取表格列表');
      if (data.data && data.data.items) {
        console.log(`📋 找到 ${data.data.items.length} 个表格:`);
        data.data.items.forEach((sheet, index) => {
          console.log(`  ${index + 1}. ${sheet.title} (ID: ${sheet.spreadsheet_token})`);
        });
      }
      return true;
    } else {
      console.error('❌ 表格API错误:', data.msg);
      return false;
    }
    
  } catch (error) {
    console.error('❌ 测试表格权限失败:', error);
    return false;
  }
}

// 测试工作台权限
async function testWorkplacePermission(accessToken) {
  console.log('🏢 测试工作台权限...');
  
  try {
    // 尝试获取工作台信息
    const response = await fetch('https://open.feishu.cn/open-apis/contact/v3/scope', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 工作台权限响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 获取工作台信息失败:', errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('📄 工作台信息:', data);
    
    if (data.code === 0) {
      console.log('✅ 成功获取工作台信息');
      return true;
    } else {
      console.error('❌ 工作台API错误:', data.msg);
      return false;
    }
    
  } catch (error) {
    console.error('❌ 测试工作台权限失败:', error);
    return false;
  }
}

// 运行完整诊断
async function runFullDiagnosis() {
  console.log('🔍 开始完整权限诊断...');
  console.log('='.repeat(60));
  
  // 1. 测试基础权限
  const basicOk = await testBasicPermissions();
  console.log('='.repeat(60));
  
  if (!basicOk) {
    console.log('❌ 基础配置有问题，停止诊断');
    return;
  }
  
  // 2. 测试访问令牌
  const accessToken = await testAccessToken();
  console.log('='.repeat(60));
  
  if (!accessToken) {
    console.log('❌ 无法获取访问令牌，停止诊断');
    return;
  }
  
  // 3. 测试应用信息
  const appInfoOk = await testAppInfo(accessToken);
  console.log('='.repeat(60));
  
  // 4. 测试表格权限
  const sheetsOk = await testSheetsPermission(accessToken);
  console.log('='.repeat(60));
  
  // 5. 测试工作台权限
  const workplaceOk = await testWorkplacePermission(accessToken);
  console.log('='.repeat(60));
  
  // 6. 生成诊断报告
  console.log('📊 权限诊断报告:');
  console.log('- 基础配置:', basicOk ? '✅ 正常' : '❌ 异常');
  console.log('- 访问令牌:', accessToken ? '✅ 正常' : '❌ 异常');
  console.log('- 应用信息:', appInfoOk ? '✅ 正常' : '❌ 异常');
  console.log('- 表格权限:', sheetsOk ? '✅ 正常' : '❌ 异常');
  console.log('- 工作台权限:', workplaceOk ? '✅ 正常' : '❌ 异常');
  
  if (!sheetsOk) {
    console.log('\n💡 建议修复步骤:');
    console.log('1. 在飞书开放平台添加以下权限:');
    console.log('   - sheets:read (读取表格)');
    console.log('   - sheets:write (写入表格)');
    console.log('   - sheets:readonly (只读表格)');
    console.log('2. 确保应用已发布并启用');
    console.log('3. 检查应用是否在工作台中可见');
  }
  
  console.log('='.repeat(60));
  console.log('🔧 诊断完成');
}

// 导出函数供手动调用
window.sheetsDiagnosis = {
  testBasic: testBasicPermissions,
  testToken: testAccessToken,
  testApp: testAppInfo,
  testSheets: testSheetsPermission,
  testWorkplace: testWorkplacePermission,
  runDiagnosis: runFullDiagnosis
};

console.log('✅ 权限诊断脚本加载完成');
console.log('💡 使用方法:');
console.log('- 基础权限测试: sheetsDiagnosis.testBasic()');
console.log('- 访问令牌测试: sheetsDiagnosis.testToken()');
console.log('- 应用信息测试: sheetsDiagnosis.testApp()');
console.log('- 表格权限测试: sheetsDiagnosis.testSheets()');
console.log('- 工作台权限测试: sheetsDiagnosis.testWorkplace()');
console.log('- 完整诊断: sheetsDiagnosis.runDiagnosis()');
