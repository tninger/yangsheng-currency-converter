const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }
  
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'text/plain';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // 文件不存在
        fs.readFile('./404.html', (error, content) => {
          if (error) {
            res.writeHead(500);
            res.end('服务器错误');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end('服务器错误: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 实时汇率换算器服务器运行在 http://localhost:${PORT}`);
  console.log(`📁 项目目录: ${__dirname}`);
  console.log('✨ 功能特点:');
  console.log('   • 10种主要货币实时换算');
  console.log('   • 简洁现代的UI设计');
  console.log('   • 支持货币交换');
  console.log('   • 自动获取最新汇率');
  console.log('   • 键盘快捷键支持');
  console.log('');
  console.log('🛠️ 快捷键:');
  console.log('   • Ctrl+R - 刷新汇率');
  console.log('   • Ctrl+S - 交换货币');
  console.log('   • Esc - 重置');
  console.log('');
  console.log('📱 在浏览器中打开上述地址即可使用');
});