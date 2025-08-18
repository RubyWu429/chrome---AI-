// 快速修复脚本 - 用于诊断和修复飞书API问题
// 在Chrome扩展的控制台中运行此脚本

console.log('🔧 开始运行快速修复脚本...');

// 检查当前配置
async function checkCurrentConfig() {
  console.log('📋 检查当前配置...');
  
  try {
    const result = await chrome.storage.sync.get([
      'deepseekApiKey', 
      'feishuAppId', 
      'feishuAppSecret', 
      'defaultCategory', 
      'defaultTemplate'
    ]);
    
    console.log('✅ 当前配置:');
    console.log('- DeepSeek API密钥:', result.deepseekApiKey ? '已配置' : '未配置');
    console.log('- 飞书App ID:', result.feishuAppId || '未配置');
    console.log('- 飞书App Secret:', result.feishuAppSecret ? '已配置' : '未配置');
    console.log('- 默认分类:', result.defaultCategory || '未设置');
    console.log('- 默认模板:', result.defaultTemplate || '未设置');
    
    return result;
  } catch (error) {
    console.error('❌ 检查配置失败:', error);
    return null;
  }
}

// 测试飞书连接
async function testFeishuConnection() {
  console.log('🔗 测试飞书连接...');
  
  try {
    const result = await chrome.storage.sync.get(['feishuAppId', 'feishuAppSecret']);
    
    if (!result.feishuAppId || !result.feishuAppSecret) {
      console.error('❌ 飞书配置不完整，请先配置App ID和App Secret');
      return false;
    }
    
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
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ 获取访问令牌失败:', tokenResponse.status, errorText);
      return false;
    }
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.code !== 0) {
      console.error('❌ 飞书API错误:', tokenData.msg);
      return false;
    }
    
    const accessToken = tokenData.tenant_access_token;
    console.log('✅ 成功获取访问令牌');
    
    // 测试应用访问
    const appResponse = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${result.feishuAppId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!appResponse.ok) {
      const errorText = await appResponse.text();
      console.error('❌ 应用访问失败:', appResponse.status, errorText);
      return false;
    }
    
    console.log('✅ 应用访问成功');
    
    // 测试表格访问
    const tablesResponse = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${result.feishuAppId}/tables`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!tablesResponse.ok) {
      const errorText = await tablesResponse.text();
      console.error('❌ 表格访问失败:', tablesResponse.status, errorText);
      return false;
    }
    
    const tablesData = await tablesResponse.json();
    
    if (tablesData.code === 0 && tablesData.data && tablesData.data.items) {
      console.log(`✅ 找到 ${tablesData.data.items.length} 个表格:`);
      tablesData.data.items.forEach((table, index) => {
        console.log(`  ${index + 1}. ${table.table_name} (ID: ${table.table_id})`);
      });
      return true;
    } else {
      console.warn('⚠️ 没有找到表格');
      return false;
    }
    
  } catch (error) {
    console.error('❌ 测试飞书连接失败:', error);
    return false;
  }
}

// 重置配置
async function resetConfig() {
  console.log('🔄 重置配置...');
  
  try {
    await chrome.storage.sync.clear();
    console.log('✅ 配置已重置');
    
    // 设置默认值
    await chrome.storage.sync.set({
      defaultCategory: '产品类',
      defaultTemplate: '通用模板'
    });
    
    console.log('✅ 已设置默认分类和模板');
    return true;
  } catch (error) {
    console.error('❌ 重置配置失败:', error);
    return false;
  }
}

// 创建测试表格
async function createTestTable() {
  console.log('📊 创建测试表格...');
  
  try {
    const result = await chrome.storage.sync.get(['feishuAppId', 'feishuAppSecret']);
    
    if (!result.feishuAppId || !result.feishuAppSecret) {
      console.error('❌ 请先配置飞书应用信息');
      return false;
    }
    
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
    
    if (!tokenResponse.ok) {
      console.error('❌ 获取访问令牌失败');
      return false;
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.tenant_access_token;
    
    // 创建表格
    const createTableResponse = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${result.feishuAppId}/tables`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        table: {
          name: 'AI摘要记录表',
          default_view_name: '默认视图'
        }
      })
    });
    
    if (!createTableResponse.ok) {
      const errorText = await createTableResponse.text();
      console.error('❌ 创建表格失败:', createTableResponse.status, errorText);
      return false;
    }
    
    const tableData = await createTableResponse.json();
    
    if (tableData.code === 0) {
      console.log('✅ 测试表格创建成功:', tableData.data.table_id);
      return tableData.data.table_id;
    } else {
      console.error('❌ 创建表格失败:', tableData.msg);
      return false;
    }
    
  } catch (error) {
    console.error('❌ 创建测试表格失败:', error);
    return false;
  }
}

// 运行完整诊断
async function runFullDiagnosis() {
  console.log('🔍 开始完整诊断...');
  console.log('='.repeat(50));
  
  // 1. 检查配置
  const config = await checkCurrentConfig();
  console.log('='.repeat(50));
  
  // 2. 测试飞书连接
  const feishuOk = await testFeishuConnection();
  console.log('='.repeat(50));
  
  // 3. 生成诊断报告
  console.log('📊 诊断报告:');
  console.log('- 配置完整性:', config ? '✅ 完整' : '❌ 不完整');
  console.log('- 飞书连接:', feishuOk ? '✅ 正常' : '❌ 异常');
  
  if (!feishuOk) {
    console.log('\n💡 建议修复步骤:');
    console.log('1. 检查飞书应用配置是否正确');
    console.log('2. 确认应用权限是否足够');
    console.log('3. 重新创建飞书应用');
    console.log('4. 在飞书中创建多维表格');
  }
  
  console.log('='.repeat(50));
  console.log('🔧 诊断完成');
}

// 导出函数供手动调用
window.quickFix = {
  checkConfig: checkCurrentConfig,
  testFeishu: testFeishuConnection,
  resetConfig: resetConfig,
  createTable: createTestTable,
  runDiagnosis: runFullDiagnosis
};

console.log('✅ 快速修复脚本加载完成');
console.log('💡 使用方法:');
console.log('- 检查配置: quickFix.checkConfig()');
console.log('- 测试飞书: quickFix.testFeishu()');
console.log('- 重置配置: quickFix.resetConfig()');
console.log('- 创建表格: quickFix.createTable()');
console.log('- 完整诊断: quickFix.runDiagnosis()');
