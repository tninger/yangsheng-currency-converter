// 汇率API测试脚本
const https = require('https');

console.log('🔍 测试汇率API连接...\n');

const testUrls = [
  {
    name: 'ExchangeRate-API (主要)',
    url: 'https://api.exchangerate-api.com/v4/latest/CNY'
  },
  {
    name: '备用API 1',
    url: 'https://api.frankfurter.app/latest?from=CNY'
  }
];

async function testApi(api) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const req = https.get(api.url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        try {
          const jsonData = JSON.parse(data);
          const status = res.statusCode === 200 ? '✅' : '❌';
          
          console.log(`${status} ${api.name}`);
          console.log(`   状态码: ${res.statusCode}`);
          console.log(`   响应时间: ${responseTime}ms`);
          
          if (jsonData.rates) {
            const currencies = Object.keys(jsonData.rates).slice(0, 5);
            console.log(`   支持货币: ${currencies.join(', ')}... (共${Object.keys(jsonData.rates).length}种)`);
            console.log(`   基础货币: ${jsonData.base || '未知'}`);
            console.log(`   汇率日期: ${jsonData.date || '未知'}`);
          } else {
            console.log(`   数据格式: ${data.substring(0, 100)}...`);
          }
          
          resolve({ success: true, data: jsonData });
        } catch (error) {
          console.log(`❌ ${api.name} - JSON解析失败`);
          console.log(`   错误: ${error.message}`);
          resolve({ success: false, error: error.message });
        }
        console.log('');
      });
    });
    
    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${api.name} - 网络错误`);
      console.log(`   错误: ${error.message}`);
      console.log(`   尝试时间: ${responseTime}ms\n`);
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`❌ ${api.name} - 请求超时 (10秒)`);
      console.log('');
      resolve({ success: false, error: 'timeout' });
    });
  });
}

async function runTests() {
  console.log('📊 汇率API连接测试\n');
  console.log('='.repeat(50) + '\n');
  
  const results = [];
  
  for (const api of testUrls) {
    results.push(await testApi(api));
  }
  
  console.log('='.repeat(50));
  console.log('\n📈 测试总结:\n');
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`✅ 成功: ${successCount}/${totalCount}`);
  
  if (successCount > 0) {
    console.log('🎉 至少有一个API可用，应用可以正常工作！');
    console.log('\n💡 建议:');
    console.log('   1. 主要API失败时会自动使用备用数据');
    console.log('   2. 应用每5分钟自动刷新汇率');
    console.log('   3. 用户可手动按 Ctrl+R 刷新');
  } else {
    console.log('⚠️  所有API测试失败，将使用预设汇率数据');
    console.log('\n🔧 解决方案:');
    console.log('   1. 检查网络连接');
    console.log('   2. 稍后重试');
    console.log('   3. 应用将使用内置的预设汇率');
  }
  
  console.log('\n🚀 启动应用命令:');
  console.log('   cd ~/.openclaw/workspace/currency-converter');
  console.log('   node server.js');
  console.log('\n🌐 然后在浏览器中访问: http://localhost:3000');
}

runTests().catch(console.error);