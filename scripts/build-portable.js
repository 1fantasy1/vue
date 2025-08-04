const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始构建便携版应用...');

try {
  // 1. 构建 Vue 应用
  console.log('📦 构建 Vue 应用...');
  execSync('npm run build:electron', { stdio: 'inherit' });

  // 2. 构建便携版 Electron 应用
  console.log('🔧 构建便携版 Electron 应用...');
  execSync('electron-builder --win --config.win.target=portable --publish=never', { stdio: 'inherit' });

  // 3. 创建便携版文件夹结构
  const portableDir = path.join(__dirname, '../dist-electron/portable');
  const exePath = path.join(__dirname, '../dist-electron/鸿庆书云 1.0.0.exe');
  
  if (fs.existsSync(exePath)) {
    if (!fs.existsSync(portableDir)) {
      fs.mkdirSync(portableDir, { recursive: true });
    }

    // 复制可执行文件
    const targetExePath = path.join(portableDir, '鸿庆书云.exe');
    fs.copyFileSync(exePath, targetExePath);

    // 创建数据目录
    const dataDir = path.join(portableDir, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 创建便携版说明文件
    const readmePath = path.join(portableDir, 'README.txt');
    const readmeContent = `鸿庆书云 - 便携版

这是鸿庆书云的便携版本，无需安装即可运行。

使用说明：
1. 直接双击 "鸿庆书云.exe" 运行应用
2. 所有数据和配置文件将保存在 "data" 文件夹中
3. 可以将整个文件夹复制到任何位置使用

注意事项：
- 请勿删除 data 文件夹，它包含您的所有数据
- 建议定期备份 data 文件夹

版本：1.0.0
构建时间：${new Date().toLocaleString('zh-CN')}
`;
    fs.writeFileSync(readmePath, readmeContent, 'utf8');

    console.log('✅ 便携版构建完成！');
    console.log(`📂 输出目录: ${portableDir}`);
    console.log('🎉 您可以将整个 portable 文件夹复制到任何地方使用');
  } else {
    console.error('❌ 未找到构建的可执行文件');
  }

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}
