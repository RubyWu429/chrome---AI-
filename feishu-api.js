// 飞书API集成模块 - 简化版本
class FeishuAPI {
  constructor() {
    this.baseUrl = 'https://open.feishu.cn/open-apis';
    // 从URL中提取的表格ID
    this.tableId = 'DqfMwN8PricflbkQTX6cHEHxnth';
  }
  
  // 获取访问令牌
  async getAccessToken() {
    try {
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
      
      return data.tenant_access_token;
    } catch (error) {
      console.error('获取飞书访问令牌失败:', error);
      throw error;
    }
  }
  
  // 添加数据到表格
  async addToTable(summary, url, title) {
    try {
      const accessToken = await this.getAccessToken();
      
      // 获取表格的详细信息
      const tableInfo = await this.getTableInfo(accessToken);
      
      // 添加记录到表格
      const response = await fetch(`${this.baseUrl}/bitable/v1/apps/${this.tableId}/tables/${tableInfo.table_id}/records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            '摘要': summary,
            '链接': url,
            '标题': title,
            '时间': new Date().toLocaleString('zh-CN')
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`添加到飞书表格失败: ${errorData.msg || response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.code !== 0) {
        throw new Error(`飞书API错误: ${data.msg || '未知错误'}`);
      }
      
      console.log('成功添加到飞书表格:', data);
      return data;
      
    } catch (error) {
      console.error('飞书API错误:', error);
      throw error;
    }
  }
  
  // 获取表格信息
  async getTableInfo(accessToken) {
    try {
      const response = await fetch(`${this.baseUrl}/bitable/v1/apps/${this.tableId}/tables`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('获取表格信息失败');
      }
      
      const data = await response.json();
      
      if (data.code !== 0 || !data.data.items || data.data.items.length === 0) {
        throw new Error('未找到可用的表格');
      }
      
      // 返回第一个表格的信息
      return {
        table_id: data.data.items[0].table_id,
        table_name: data.data.items[0].table_name
      };
      
    } catch (error) {
      console.error('获取表格信息失败:', error);
      throw error;
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
  
  // 测试连接
  async testConnection() {
    try {
      const accessToken = await this.getAccessToken();
      const tableInfo = await this.getTableInfo(accessToken);
      return {
        success: true,
        message: `连接成功！找到表格: ${tableInfo.table_name}`,
        tableInfo: tableInfo
      };
    } catch (error) {
      return {
        success: false,
        message: `连接失败: ${error.message}`,
        error: error
      };
    }
  }
}

// 导出FeishuAPI类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FeishuAPI;
} else {
  window.FeishuAPI = FeishuAPI;
} 