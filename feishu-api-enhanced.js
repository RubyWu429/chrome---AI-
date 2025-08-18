// 增强版飞书API集成模块 - 实现自动粘贴和文章分类

class FeishuAPIEnhanced {
  constructor() {
    this.baseUrl = 'https://open.feishu.cn/open-apis';
    this.accessToken = null;
    this.tokenExpiry = null;
  }
  
  // 获取访问令牌
  async getAccessToken() {
    try {
      // 检查令牌是否还有效
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }
      
      const appId = await this.getStoredValue('feishuAppId');
      const appSecret = await this.getStoredValue('feishuAppSecret');
      
      if (!appId || !appSecret) {
        throw new Error('请先配置飞书应用的App ID和App Secret');
      }
      
      const response = await fetch(`${this.baseUrl}/auth/v3/tenant_access_token/internal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          app_id: appId,
          app_secret: appSecret
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`获取飞书访问令牌失败: ${errorData.msg || response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.code !== 0) {
        throw new Error(`飞书API错误: ${data.msg || '未知错误'}`);
      }
      
      // 保存令牌和过期时间（提前5分钟过期）
      this.accessToken = data.tenant_access_token;
      this.tokenExpiry = Date.now() + (data.expire * 1000) - (5 * 60 * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('获取飞书访问令牌失败:', error);
      throw error;
    }
  }
  
  // 获取飞书多维表格应用信息
  async getFeishuApps() {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.baseUrl}/bitable/v1/apps`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('获取飞书应用列表失败');
      }
      
      const data = await response.json();
      
      if (data.code !== 0) {
        throw new Error(`飞书API错误: ${data.msg || '未知错误'}`);
      }
      
      return data.data.items || [];
    } catch (error) {
      console.error('获取飞书应用列表失败:', error);
      throw error;
    }
  }
  
  // 获取或创建分类表格
  async getOrCreateCategoryTable(appId, category) {
    try {
      const accessToken = await this.getAccessToken();
      
      // 首先尝试获取现有的表格
      const response = await fetch(`${this.baseUrl}/bitable/v1/apps/${appId}/tables`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.code === 0 && data.data.items) {
          // 查找对应分类的表格
          const targetTable = data.data.items.find(table => 
            table.table_name === category || table.table_name.includes(category)
          );
          
          if (targetTable) {
            console.log(`找到现有表格: ${targetTable.table_name}`);
            return targetTable.table_id;
          }
        }
      }
      
      // 如果没有找到对应表格，创建一个新的
      console.log(`未找到对应表格，创建新表格: ${category}`);
      return await this.createCategoryTable(accessToken, appId, category);
      
    } catch (error) {
      console.error('获取表格失败，创建新表格:', error);
      return await this.createCategoryTable(accessToken, appId, category);
    }
  }
  
  // 创建分类表格
  async createCategoryTable(accessToken, appId, category) {
    const response = await fetch(`${this.baseUrl}/bitable/v1/apps/${appId}/tables`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        table: {
          name: category,
          fields: [
            {
              field_name: '原文信息',
              type: 1, // 文本类型
              property: {
                text: {
                  link: {
                    url: ''
                  }
                }
              }
            },
            {
              field_name: '文章总结',
              type: 1 // 文本类型
            },
            {
              field_name: '分类',
              type: 1 // 文本类型
            },
            {
              field_name: '添加时间',
              type: 5 // 日期时间类型
            }
          ]
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`创建表格失败: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 0) {
      throw new Error(`飞书API错误: ${data.msg || '未知错误'}`);
    }
    
    console.log(`成功创建表格: ${category}`);
    return data.data.table_id;
  }
  
  // 添加记录到分类表格
  async addRecordToCategoryTable(appId, tableId, summary, pageUrl, pageTitle, category) {
    try {
      const accessToken = await this.getAccessToken();
      const currentTime = new Date().toLocaleString('zh-CN');
      
      // 格式化原文信息
      const originalInfo = `原文链接：${pageUrl}\n\n文章标题：${pageTitle}\n\n分析时间：${currentTime}`;
      
      const response = await fetch(`${this.baseUrl}/bitable/v1/apps/${appId}/tables/${tableId}/records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            '原文信息': originalInfo,
            '文章总结': summary,
            '分类': category,
            '添加时间': currentTime
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`添加记录失败: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.code !== 0) {
        throw new Error(`飞书API错误: ${data.msg || '未知错误'}`);
      }
      
      console.log('成功添加记录到飞书表格');
      return data.data;
      
    } catch (error) {
      console.error('添加记录到表格失败:', error);
      throw error;
    }
  }
  
  // 主要方法：自动归类并添加到飞书表格
  async autoCategorizeAndAdd(summary, pageUrl, pageTitle, category) {
    try {
      console.log(`开始处理文章，分类: ${category}`);
      
      // 获取飞书应用列表
      const apps = await this.getFeishuApps();
      
      if (apps.length === 0) {
        throw new Error('未找到可用的飞书多维表格应用');
      }
      
      // 使用第一个应用（或者你可以指定特定的应用ID）
      const targetApp = apps[0];
      console.log(`使用飞书应用: ${targetApp.name}`);
      
      // 获取或创建分类表格
      const tableId = await this.getOrCreateCategoryTable(targetApp.app_token, category);
      
      // 添加记录到表格
      const record = await this.addRecordToCategoryTable(targetApp.app_token, tableId, summary, pageUrl, pageTitle, category);
      
      return {
        success: true,
        appName: targetApp.name,
        tableId: tableId,
        record: record,
        message: `文章已成功归类到"${category}"并添加到飞书表格！`
      };
      
    } catch (error) {
      console.error('自动归类并添加失败:', error);
      return {
        success: false,
        error: error.message,
        message: `添加失败: ${error.message}`
      };
    }
  }
  
  // 测试连接
  async testConnection() {
    try {
      const accessToken = await this.getAccessToken();
      const apps = await this.getFeishuApps();
      
      return {
        success: true,
        message: `连接成功！找到 ${apps.length} 个飞书多维表格应用`,
        apps: apps
      };
    } catch (error) {
      return {
        success: false,
        message: `连接失败: ${error.message}`,
        error: error
      };
    }
  }
  
  // 从存储中获取值
  async getStoredValue(key) {
    return new Promise((resolve) => {
      chrome.storage.sync.get([key], (result) => {
        resolve(result[key]);
      });
    });
  }
  
  // 保存值到存储
  async setStoredValue(key, value) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [key]: value }, resolve);
    });
  }
}

// 导出FeishuAPIEnhanced类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FeishuAPIEnhanced;
} else {
  window.FeishuAPIEnhanced = FeishuAPIEnhanced;
}
