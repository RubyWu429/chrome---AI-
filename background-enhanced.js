// 增强版background.js - 【最终智能分类版 - 更新Prompt模板】

console.log('🚀 AI摘要助手 - 增强版本已加载');

// 【已更新】摘要模板定义
const SUMMARY_TEMPLATES = {
  "通用模板": "你是一个专业的文章摘要助手。请对给定的文本内容进行简洁、准确的摘要，突出主要观点和关键信息。摘要长度控制在600字以内，使用中文回复，输出格式美观易读。。",
  "Claude CEO框架": "你是一个专业的文章摘要助手。请根据claude首席执行官的产品分析框架，对给定的文本内容进行简洁、准确的摘要，突出主要观点和关键信息（当然，你不要非要把文章和给定的产品分析框架扯上关系，如果完全扯不上关系的话，你只需要总结文章观点即可。）。摘要长度控制在600字以内，使用中文回复，输出格式美观易读。claude首席执行官产品分析框架： \n\n1. 核心转变：瓶颈从“技术实现”转向“战略决策”\nAI让“做出产品”变得极其廉价和快速，解决了过去的执行瓶颈。现在，新的瓶颈在于“做什么”——即如何做出正确的战略选择、验证用户价值和确定优先级。\n\n2. 产品经理角色“升维”：从项目执行者到战略指挥官\nAI接管了大量的执行工作，产品经理必须向上游移动，专注于更高层次的战略任务。工作重心不再是推动功能开发，而是与AI协作，定义正确的产品方向。\n\n3. 三大关键新能力：\n\n系统化思维：关注整体架构与战略布局，而非孤立功能。\n\n科学实验：利用快速迭代能力，设计有效实验来验证假设。\n\n战略判断：在AI提供的海量可能性中，做出明智的“做什么”与“不做什么”的决策。\n\n4. 人类不可替代的价值：\n在AI时代，人类的独特价值在于：\n\n提升易用性：将复杂技术转化为普通人能用的产品。\n\n价值判断：做出超越数据和逻辑的、基于商业和人文的战略选择。\n\n引领愿景：探索并展示技术应用的未来可能性。\n\n结论： 未来最重要的“元技能”是与AI高效协作的能力。这要求人类从被动的工具使用者，转变为主动的、与AI共同思考和决策的“驾驶员”。",
  "Anthropic CPO框架": "你是一个专业的文章摘要助手。请根据Anthropic 首席产品官的产品分析框架，对给定的文本内容进行简洁、准确的摘要，突出主要观点和关键信息（当然，你不要非要把文章和给定的产品分析框架扯上关系，如果完全扯不上关系的话，你只需要总结文章观点即可。）。摘要长度控制在600字以内，使用中文回复，输出格式美观易读。这里是 Anthropic 首席产品官 Mike Krieger 产品分析框架的简洁总结：\n\n核心论点：AI 领域的持久竞争优势已超越模型性能，决定性因素在于产品、人才和市场策略的结合。\n\n1. 价值创造框架：在交叉点上取胜\n真正的持久价值并非来自通用模型，而是在于三个要素的交集：\n\n差异化市场策略 (Go-to-Market)：如何进入市场。\n\n特定行业知识 (Vertical Expertise)：深耕金融、法律、医疗等高壁垒领域。\n\n独特数据 (Unique Data)：拥有专有数据集。\n\n2. AI 产品设计原则：为不确定性而设计\n核心挑战：在“展示未来”和“兑现当前能力”之间取得平衡，避免因过度承诺而破坏用户信任。\n\n差异化关键：AI 产品的品牌忠诚度来自于模型的“个性”和“氛围”，以及围绕模型构建的用户体验，而不纯粹是功能。\n\n新设计范式：产品、设计和工程团队必须为非确定性系统进行设计，将模型评测和提示工程融入产品开发核心。\n\n3. 竞争优势的三大支柱\n在基础模型层面，建立护城河需要投资于：\n\n顶尖人才 (Talent)：人才是发现正确突破方向的根本。\n\n模型差异化 (Differentiation)：强化模型独特的“个性”和能力优势，未来模型会变得更不相同而非趋同。\n\n深度合作 (Partnerships)：超越简单的 API 调用，成为客户的“AI 战略合作伙伴”，共同设计解决方案。\n\n4. 最终目标：追求深度产品市场契合度 (Deep PMF)\n清醒认知：承认当前产品的快速采用（Adoption）领先于真正的产品市场契合度（PMF）。用户目前是为模型而来，但这不可持续。\n\n行业核心挑战：将 AI 从一个偶尔使用的“浅价值”工具（写诗、写信），转变为无缝融入用户日常工作流程、不可或缺的“深价值”工具。\n\n组织敏捷性：即使公司规模扩大，也必须保持初创公司的思维和迭代速度，打破组织壁垒，快速协作。",
  "Peter Deng框架": "你是一个专业的文章摘要助手。请根据Peter Deng 的产品分析框架，对给定的文本内容进行简洁、准确的摘要，突出主要观点和关键信息（当然，你不要非要把文章和给定的产品分析框架扯上关系，如果完全扯不上关系的话，你只需要总结文章观点即可。）。摘要长度控制在600字以内，使用中文回复，输出格式美观易读。以下是 Peter Deng 的产品、组织与领导力框架的简洁总结。\n\n该框架的核心思想是：在AI时代，技术本身并非护城河，真正的护城河是由具备审美与判断力的人才所构建的、深度整合了数据与工作流的“系统”。超级智能的价值不在于自动化，而在于激发人类的创造力。\n\n1. AI 时代的价值创造框架\n核心论点：AI 领域最被高估的是“智能本身”，最被低估的是产品设计。竞争的关键不是模型强弱，而是谁能跑通 “模型 → Agent → 工作流 → 价值闭环” 的系统链条。\n\nAI 创业两大支柱：\n\n数据飞轮 (Data Flywheel)：获取并持续生成独特的、专有的数据，以不断优化模型和产品。\n\n工作流整合 (Workflow Integration)：将产品深度嵌入垂直行业或个人用户的核心工作流程中，使其变得不可或缺，从而改变用户习惯。\n\n产品技艺 (Product Craft) 的回归：随着基础模型能力趋同，能打动用户的精妙产品细节、令人愉悦的体验和流畅的工作流，将成为最终的差异化优势。\n\n2. 从 0 到 100 的系统性思维\n阶段划分：\n\n0 → 1 阶段：核心任务是寻找产品市场契合度（PMF）。\n\n1 → 100 阶段：核心任务是构建能够持续加速的系统。此时需要“慢下来才能更快”，进行前瞻性规划和架构设计，而非简单地快速迭代。\n\n关键工具：建立增长团队\n\n增长团队的价值不仅在于驱动增长数字，更在于其“二阶效应”：他们会通过提问和实验，倒逼整个组织实现数据驱动和运营严谨，为规模化增长奠定基础。\n\n3. 组织与团队设计：“把团队当产品来打磨”\n核心理念：最成功的团队是能力互补、充满健康张力的“复仇者联盟”，而非同质化的“劳动力”。领导者的工作是设计这个团队“产品”。\n\n五种产品经理原型 (The 5 PM Archetypes)：通过招聘这五种不同特质的PM，来构建视野全面、决策平衡的团队。\n\n消费者型 (Consumer PM)：半个设计师，注重体验、细节和工艺。\n\n增长型 (Growth PM)：半个数据科学家，以数据为导向，充满怀疑精神。\n\n商业型 (Business PM)：半个MBA，从商业模式、激励机制和市场角度思考。\n\n平台型 (Platform PM)：擅长为他人构建工具和系统，思考抽象与扩展。\n\n研究/AI型 (Research/AI PM)：研究员与PM的结合体，深度理解技术并具备产品品味。\n\n4. 领导力与招聘哲学\n招聘两大秘诀：\n\n“六个月原则” (The 6-Month Rule)：用于筛选具备自主性、判断力和主动性的人才。“如果六个月后，我还得告诉你该做什么，那就是我招错人了。”\n\n成长型思维 (Growth Mindset)：这是他在最终面试轮唯一考察的特质。他相信技能可以培养，但自省、乐于接受反馈和渴望进步的心态是团队成功的“元”因素。\n\n核心管理技巧：\n\n发挥优势：帮助团队成员发现并创造能最大化其独特优势的岗位（如为Joanne Jiang创造“模型设计师”职位）。\n\n高效沟通循环：“说你要做什么，说你正在做，最后说你完成了。” 这是一个确保目标对齐、同步进展并闭环反馈的简单技巧。\n\n产品第一原则：共情 (Empathy)\n\n回归设计思维的本源，强调必须亲身感受用户的痛苦，而不只是理论上理解。亲自用户调研、体验产品（Dogfooding）是不可替代的，因为“轶事比数据更可信”。"
};

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  console.log('📋 正在创建右键菜单...');
  chrome.contextMenus.create({
    id: "summarizeAndAddToFeishu",
    title: "自动摘要并添加到飞书表格",
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

    try {
      chrome.action.setBadgeText({ text: "处理中" });
      chrome.action.setBadgeBackgroundColor({ color: "#4285f4" });
      
      const result = await chrome.storage.sync.get([
        'deepseekApiKey', 'defaultTemplate',
        'feishuAppId', 'feishuAppSecret', 'feishuTableUrl'
      ]);

      const template = result.defaultTemplate || '通用模板';
      
      console.log('🤖 开始调用AI进行智能分析(摘要+分类)...');
      const analysisResult = await getAiAnalysis(selectedText, result.deepseekApiKey, template);
      
      console.log('✅ AI分析完成:');
      console.log(`   - 智能分类结果: ${analysisResult.category}`);
      console.log(`   - 生成摘要长度: ${analysisResult.summary.length}`);

      await addToFeishuTable(analysisResult.summary, pageUrl, pageTitle, analysisResult.category, result);

      chrome.action.setBadgeText({ text: "完成" });
      chrome.action.setBadgeBackgroundColor({ color: "#34a853" });
      setTimeout(() => chrome.action.setBadgeText({ text: "" }), 3000);

    } catch (error) {
      console.error('❌ 处理失败:', error);
      chrome.notifications.create({
        type: 'basic', iconUrl: 'icons/icon48.png', 
        title: 'AI摘要助手 - 处理失败', message: error.message
      });
      chrome.action.setBadgeText({ text: "错误" });
      chrome.action.setBadgeBackgroundColor({ color: "#ea4335" });
      setTimeout(() => chrome.action.setBadgeText({ text: "" }), 5000);
    }
  }
});

// 全新的AI分析函数，要求AI同时输出分类和摘要
async function getAiAnalysis(text, apiKey, template) {
  // 根据用户选择的模板，获取对应的详细框架描述
  const frameworkDescription = SUMMARY_TEMPLATES[template] || SUMMARY_TEMPLATES["通用模板"];

  const systemPrompt = `你是一个专业的文章分析助手。你的任务是同时完成以下两件事：
1.  **分类**：仔细阅读文本，判断其核心内容属于 "产品类"、"技术类" 还是 "趋势类" 中的哪一个。
2.  **摘要**：根据用户指定的分析框架为文本生成一段200-300字的专业摘要。

这是用户指定的分析框架描述：
---
${frameworkDescription}
---

**重要格式要求**：
-   摘要内容必须使用Markdown格式。
-   关键信息点需要分点论述，使用项目符号（例如 '*' 或 '-'）。
-   对摘要中的核心术语或关键数据进行**加粗**处理，以突出重点。

你必须以一个严格的JSON格式返回你的分析结果，格式如下，不要有任何多余的文字说明：
{
  "category": "这里填入你判断出的分类",
  "summary": "这里填入你生成的、符合Markdown格式要求的摘要"
}
`;

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      response_format: { type: "json_object" }, // 强制要求返回JSON
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `请分析以下文本：\n\n${text}` }
      ],
    })
  });
  
  if (!response.ok) {
    throw new Error(`AI分析API错误: ${response.status}`);
  }
  
  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    const result = JSON.parse(content);
    if (!result.category || !result.summary) {
      throw new Error("AI返回的JSON格式不完整。");
    }
    return result;
  } catch (e) {
    console.error("解析AI返回的JSON失败:", content);
    throw new Error("无法解析AI的分析结果，请稍后重试。");
  }
}

// 入口函数，现在接收AI判断出的category
async function addToFeishuTable(summary, pageUrl, pageTitle, category, config) {
  try {
    const { feishuAppId: appId, feishuAppSecret: appSecret, feishuTableUrl: tableUrl } = config;
    if (!appId || !appSecret || !tableUrl) throw new Error('飞书配置不完整');

    const accessToken = await getFeishuAccessToken(appId, appSecret);
    const tableInfo = getTableInfoFromUrl(tableUrl, appId);
    
    await addRecordToTable(accessToken, tableInfo, summary, pageUrl, pageTitle, category);
    
    console.log('✅ 成功添加记录到飞书表格');
    chrome.notifications.create({
      type: 'basic', iconUrl: 'icons/icon48.png',
      title: 'AI摘要助手', message: `文章已智能识别为"${category}"并添加到飞书！`
    });
  } catch (error) {
    console.error('❌ 添加到飞书表格失败:', error);
    throw error;
  }
}

// 获取飞书Token的函数
async function getFeishuAccessToken(appId, appSecret) {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret })
  });
  const data = await response.json();
  if (data.code !== 0) throw new Error(`获取飞书Token失败: ${data.msg}`);
  return data.tenant_access_token;
}

// 从URL解析表格信息的函数
function getTableInfoFromUrl(tableUrl, appId) {
  try {
    const url = new URL(tableUrl);
    if (url.pathname.includes('/sheets/')) {
      const match = url.pathname.match(/\/sheets\/([^\/\?]+)/);
      const sheetId = url.searchParams.get('sheet');
      if (match && sheetId) {
        return { appId, type: 'sheets', spreadsheetId: match[1], sheetId };
      }
    }
    throw new Error('链接格式无法识别或缺少sheet参数');
  } catch (error) {
    throw new Error(`解析链接失败: ${error.message}`);
  }
}

// 写入飞书表格的函数
async function addRecordToTable(accessToken, tableInfo, summary, pageUrl, pageTitle, category) {
  const currentTime = new Date().toLocaleString('zh-CN', { hour12: false });
  const originalInfo = `原文链接：${pageUrl}\n\n文章标题：${pageTitle}\n\n分析时间：${currentTime}`;
  
  const { type, spreadsheetId, sheetId } = tableInfo;

  let endpoint, body;
  
  if (type === 'sheets') {
    endpoint = `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${spreadsheetId}/values_append`;
    body = {
      valueRange: {
        range: sheetId,
        values: [ [category, originalInfo, summary] ] 
      }
    };
  } else {
    throw new Error(`当前逻辑仅支持电子表格(Sheets)，不支持类型: "${type}"`);
  }
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  const responseData = await response.json();

  if (!response.ok || responseData.code !== 0) {
    throw new Error(`写入飞书失败: ${responseData.msg || '未知错误'}`);
  }
  console.log(`✅ API调用成功`);
}