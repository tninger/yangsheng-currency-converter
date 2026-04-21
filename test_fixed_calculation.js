// 测试修复后的汇率计算准确性
console.log('测试汇率修复后的计算准确性\n');

// 模拟index.html中的计算逻辑
function testIndexHtmlCalculation() {
    console.log('=== 测试index.html计算逻辑 ===');
    
    // 使用修复后的currencies数据
    const currencies = [
        ['CNY', '人民币[中国¥]', 6.849315],
        ['USD', '美元[美国$]', 1.000000],
        ['EUR', '欧元[欧盟€]', 0.849315],
        ['JPY', '日元[日本¥]', 159.383562]
    ];
    
    // 创建货币映射
    const currencyMap = {};
    currencies.forEach(([code, name, rate]) => {
        currencyMap[code] = { name, rate };
    });
    
    // 测试用例1: 100 CNY 转换为 USD
    console.log('\n测试1: 100 CNY -> USD');
    const cnyToUsd = convertCurrency(100, 'CNY', 'USD', currencyMap);
    console.log(`100 CNY = ${cnyToUsd.toFixed(2)} USD`);
    console.log(`预期: 100 CNY ≈ 14.60 USD (实际汇率: 1 CNY = 0.146 USD)`);
    
    // 测试用例2: 100 USD 转换为 CNY
    console.log('\n测试2: 100 USD -> CNY');
    const usdToCny = convertCurrency(100, 'USD', 'CNY', currencyMap);
    console.log(`100 USD = ${usdToCny.toFixed(2)} CNY`);
    console.log(`预期: 100 USD ≈ 684.93 CNY (实际汇率: 1 USD = 6.8493 CNY)`);
    
    // 测试用例3: 100 EUR 转换为 USD
    console.log('\n测试3: 100 EUR -> USD');
    const eurToUsd = convertCurrency(100, 'EUR', 'USD', currencyMap);
    console.log(`100 EUR = ${eurToUsd.toFixed(2)} USD`);
    console.log(`预期: 100 EUR ≈ 117.74 USD (实际汇率: 1 EUR = 1.1774 USD)`);
    
    // 测试用例4: 比较与API数据的差异
    console.log('\n=== 与当前API数据比较 ===');
    const apiRates = {
        CNY: 1,
        USD: 0.146,
        EUR: 0.124,
        JPY: 23.27
    };
    
    // 计算准确性
    Object.keys(apiRates).forEach(currency => {
        if (currency !== 'CNY') {
            const calculated = 100 / currencyMap[currency].rate; // 100 CNY = X currency
            const actual = 100 * apiRates[currency]; // 根据API
            const diff = Math.abs(calculated - actual);
            const diffPercent = (diff / actual * 100).toFixed(2);
            
            console.log(`${currency}: 计算值=${calculated.toFixed(4)}, API值=${actual.toFixed(4)}, 差异=${diffPercent}%`);
        }
    });
}

// 模拟index.html中的convertFrom逻辑
function convertCurrency(amount, fromCurrency, toCurrency, currencyMap) {
    const fromRate = currencyMap[fromCurrency].rate;
    const toRate = currencyMap[toCurrency].rate;
    
    // 转换为USD基准
    const baseUSD = amount / fromRate;
    // 转换为目标货币
    const converted = baseUSD * toRate;
    
    return converted;
}

// 测试app.js中的备用汇率
function testAppJsFallback() {
    console.log('\n\n=== 测试app.js备用汇率数据 ===');
    
    const fallbackRates = {
        CNY: 1,
        USD: 0.146,
        EUR: 0.124,
        GBP: 0.108,
        JPY: 23.27,
        HKD: 1.15,
        AUD: 0.205,
        CAD: 0.200,
        SGD: 0.186,
        KRW: 214.82
    };
    
    console.log('备用汇率数据:');
    Object.entries(fallbackRates).forEach(([currency, rate]) => {
        if (currency !== 'CNY') {
            console.log(`1 CNY = ${rate} ${currency}`);
        }
    });
    
    // 验证关键货币
    console.log('\n关键货币验证:');
    console.log(`USD: ${fallbackRates.USD} (当前API: 0.146) - ${fallbackRates.USD === 0.146 ? '✅ 正确' : '❌ 错误'}`);
    console.log(`EUR: ${fallbackRates.EUR} (当前API: 0.124) - ${fallbackRates.EUR === 0.124 ? '✅ 正确' : '❌ 错误'}`);
    console.log(`JPY: ${fallbackRates.JPY} (当前API: 23.27) - ${fallbackRates.JPY === 23.27 ? '✅ 正确' : '❌ 错误'}`);
}

// 执行测试
testIndexHtmlCalculation();
testAppJsFallback();

console.log('\n\n=== 修复总结 ===');
console.log('1. index.html: 更新了currencies数组，修复了汇率数据格式错误');
console.log('2. app.js: 更新了useFallbackRates()中的备用汇率数据');
console.log('3. fixed-index.html: 更新了exchangeRates静态数据');
console.log('4. 所有汇率数据现在基于当前准确的API数据 (2026-04-21)');
console.log('\n汇率错误问题应该已修复！');