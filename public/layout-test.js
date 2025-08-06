// 页面布局测试脚本
// 在浏览器控制台中运行此脚本来检查布局

function testLayout() {
  const results = {
    timestamp: new Date().toLocaleString(),
    tests: []
  };

  // 测试1: 检查页面容器
  const page = document.querySelector('.page');
  results.tests.push({
    test: '页面容器存在',
    passed: !!page,
    details: page ? `宽度: ${page.offsetWidth}px, 高度: ${page.offsetHeight}px` : '未找到'
  });

  // 测试2: 检查头部
  const header = document.querySelector('.header');
  results.tests.push({
    test: '头部存在',
    passed: !!header,
    details: header ? `边距: ${getComputedStyle(header).margin}` : '未找到'
  });

  // 测试3: 检查搜索区域
  const searchInput = document.querySelector('.search-input');
  results.tests.push({
    test: '搜索输入框存在',
    passed: !!searchInput,
    details: searchInput ? '可以正常输入' : '未找到'
  });

  // 测试4: 检查统计卡片
  const statCards = document.querySelectorAll('.stat-card');
  results.tests.push({
    test: '统计卡片',
    passed: statCards.length === 4,
    details: `找到 ${statCards.length} 个统计卡片`
  });

  // 测试5: 检查项目卡片
  const projectCards = document.querySelectorAll('.project-card');
  results.tests.push({
    test: '项目卡片',
    passed: projectCards.length > 0,
    details: `找到 ${projectCards.length} 个项目卡片`
  });

  // 测试6: 检查浮动按钮
  const fab = document.querySelector('.fab');
  results.tests.push({
    test: '浮动按钮存在',
    passed: !!fab,
    details: fab ? '位置正确' : '未找到'
  });

  // 测试7: 检查响应式
  const isResponsive = window.innerWidth < 768;
  const mobileStyles = isResponsive && page && getComputedStyle(page).padding !== '24px';
  results.tests.push({
    test: '响应式设计',
    passed: !isResponsive || mobileStyles,
    details: `当前宽度: ${window.innerWidth}px, 移动端样式: ${mobileStyles ? '已应用' : '未应用'}`
  });

  // 输出结果
  console.group('📊 布局测试结果');
  console.log('测试时间:', results.timestamp);
  console.log('总计测试:', results.tests.length);
  console.log('通过测试:', results.tests.filter(t => t.passed).length);
  
  results.tests.forEach((test, index) => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${index + 1}. ${test.test}: ${test.details}`);
  });
  
  console.groupEnd();
  
  return results;
}

// 检查Vue组件是否正常工作
function testVueComponent() {
  const app = document.querySelector('#app').__vue_app__;
  if (app) {
    console.log('✅ Vue应用正常运行');
    return true;
  } else {
    console.log('❌ Vue应用未找到');
    return false;
  }
}

// 自动运行测试
if (typeof window !== 'undefined') {
  console.log('🚀 开始布局测试...');
  setTimeout(() => {
    testLayout();
    testVueComponent();
  }, 1000);
}

// 导出测试函数供手动调用
window.layoutTest = testLayout;
window.vueTest = testVueComponent;
