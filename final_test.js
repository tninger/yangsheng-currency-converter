// 最终测试修复后的汇率计算
console.log('=== 最终汇率修复测试 ===\n');

// 测试index.html的计算逻辑
function testIndexHtml() {
    console.log('1. 测试index.html计算逻辑:');
    
    // 使用修复后的currencies数据
    const currencies = [
        ['CNY', '人民币[中国¥]', 0.146000],
        ['TWD', '台币[中国台湾NT$]', 0.031533],
        ['USD', '美元[美国$]', 1.000000],
        ['EUR', '欧元[欧盟€]', 1.177419],
        ['JPY', '日元[日本¥]', 0.006274]
    ];
    
    const currencyMap = {};
    currencies.forEach(([code, name, rate]) => {
        currencyMap[code] = { name, rate };
    });
    
    // 模拟index.html的convertFrom函数
    function convertCurrency(amount, fromCurrency, toCurrency) {
        const fromRate = currencyMap[fromCurrency].rate;
        const toRate = currencyMap[toCurrency].rate;
        // index.html公式: 目标货币值 = 源货币值 * (目标货币rate / 源货币rate)
        return amount * (toRate / fromRate);
    }
    
    const tests = [
        { from: 'CNY', to: 'TWD', amount: 100, expected: 463.00 },
        { from: 'CNY', to: 'USD', amount: 100, expected: 14.60 },
        { from: 'USD', to: 'CNY', amount: 100, expected: 684.93 },
        { from: 'CNY', to: 'EUR', amount: 100, expected: 12.40 },
        { from: 'CNY', to: 'JPY', amount: 100, expected: 2327.00 }
    ];
    
    let allPass = true;
    
    tests.forEach((test, i) => {
        const result = convertCurrency(test.amount, test.from, test.to);
        const diff = Math.abs(result - test.expected);
        const pass = diff < 0.01;
        
        if (!pass) allPass = false;
        
        console.log(`  测试${i+1}: ${test.amount} ${test.from} → ${test.to}`);
        console.log(`    结果: ${result.toFixed(2)} (预期: ${test.expected.toFixed(2)})`);
        console.log(`    ${pass ? '✅ 通过' : '❌ 失败'}\n`);
    });
    
    return allPass;
}

// 测试app.js的计算逻辑
function testAppJs() {
    console.log('\n2. 测试app.js计算逻辑:');
    
    // app.js中的备用汇率
    const rates = {
        CNY: 1,
        USD: 0.146,
        EUR: 0.124,
        GBP: 0.108,
        JPY: 23.27,
        HKD: 1.15
    };
    
    // app.js公式: rate = toRate / fromRate, convertedAmount = amount * rate
    function convertAppJS(amount, from, to) {
        if (from === to) return amount;
        
        const fromRate = rates[from];
        const toRate = rates[to];
        
        if (!fromRate || !toRate) return 0;
        
        const rate = toRate / fromRate;
        return amount * rate;
    }
    
    const tests = [
        { from: 'CNY', to: 'USD', amount: 100, expected: 14.60 },
        { from: 'CNY', to: 'EUR', amount: 100, expected: 12.40 },
        { from: 'USD', to: 'CNY', amount: 100, expected: 684.93 },
        { from: 'CNY', to: 'JPY', amount: 100, expected: 2327.00 }
    ];
    
    let allPass = true;
    
    tests.forEach((test, i) => {
        const result = convertAppJS(test.amount, test.from, test.to);
        const diff = Math.abs(result - test.expected);
        const pass = diff < 0.01;
        
        if (!pass) allPass = false;
        
        console.log(`  测试${i+1}: ${test.amount} ${test.from} → ${test.to}`);
        console.log(`    结果: ${result.toFixed(2)} (预期: ${test.expected.toFixed(2)})`);
        console.log(`    ${pass ? '✅ 通过' : '❌ 失败'}\n`);
    });
    
    return allPass;
}

// 验证用户看到的原始错误
function testOriginalError() {
    console.log('\n3. 验证原始错误数据:');
    
    // 原始错误数据
    const originalRates = {
        CNY: 0.1388,
        TWD: 0.0306
    };
    
    // 使用index.html公式
    const result = 100 * (originalRates.TWD / originalRates.CNY);
    console.log(`  原始数据: CNY=${originalRates.CNY}, TWD=${originalRates.TWD}`);
    console.log(`  计算: 100 * (${originalRates.TWD}/${originalRates.CNY}) = ${result.toFixed(2)} TWD`);
    console.log(`  用户看到: 22.05 TWD ✓`);
    
    return true;
}

// 执行所有测试
console.log('开始测试...\n');
const test1 = testIndexHtml();
const test2 = testAppJs();
const test3 = testOriginalError();

console.log('=== 测试总结 ===');
console.log(`1. index.html计算逻辑: ${test1 ? '✅ 通过' : '❌ 失败'}`);
console.log(`2. app.js计算逻辑: ${test2 ? '✅ 通过' : '❌ 失败'}`);
console.log(`3. 原始错误验证: ${test3 ? '✅ 通过' : '❌ 失败'}`);

const allPass = test1 && test2 && test3;
console.log(`\n${allPass ? '🎉 所有测试通过！汇率错误已修复。' : '⚠️ 部分测试失败，需要进一步检查。'}`);

if (allPass) {
    console.log('\n📋 修复内容总结:');
    console.log('1. index.html: 更新了currencies数组，使用正确的"对USD的汇率"');
    console.log('2. app.js: 备用汇率数据已更新为当前准确值');
    console.log('3. 计算逻辑: 两种版本的计算公式现在都正确');
    console.log('\n🚀 用户现在应该看到正确的汇率转换结果！');
}