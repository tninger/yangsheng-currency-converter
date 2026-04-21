// 测试当前使用的汇率API
console.log('测试 ExchangeRate-API 可用性...');

async function testCurrentAPI() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/CNY');
        
        console.log('API响应状态:', response.status, response.statusText);
        console.log('响应头:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            console.error('API请求失败:', response.status);
            return false;
        }
        
        const data = await response.json();
        console.log('API响应数据结构:');
        console.log('- base:', data.base);
        console.log('- date:', data.date);
        console.log('- rates对象数量:', Object.keys(data.rates || {}).length);
        
        // 检查关键货币的汇率
        const keyCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'HKD'];
        console.log('\n关键货币汇率:');
        keyCurrencies.forEach(currency => {
            const rate = data.rates[currency];
            console.log(`  ${currency}:`, rate || '无数据');
        });
        
        return true;
        
    } catch (error) {
        console.error('API测试失败:', error.message);
        console.error('错误详情:', error);
        return false;
    }
}

// 执行测试
testCurrentAPI().then(success => {
    console.log('\n测试结果:', success ? 'API可用 ✅' : 'API不可用 ❌');
    process.exit(success ? 0 : 1);
});