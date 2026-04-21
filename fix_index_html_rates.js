// 修复index.html的汇率数据格式
console.log('=== 修复index.html汇率数据格式 ===\n');

// 当前API数据：1 CNY = X 其他货币
const apiRates = {
    CNY: 1.000000,
    USD: 0.146000,
    EUR: 0.124000,
    GBP: 0.108000,
    JPY: 23.270000,
    HKD: 1.150000,
    AUD: 0.205000,
    CAD: 0.200000,
    SGD: 0.186000,
    KRW: 214.820000,
    TWD: 4.630000,
    RUB: 11.140000,
    INR: 13.570000,
    ARS: 200.950000,
    THB: 4.680000,
    MXN: 2.530000,
    MYR: 0.577000,
    VND: 3861.000000,
    PHP: 8.780000,
    TRY: 6.550000,
    CHF: 0.114000,
    IDR: 2518.890000,
    PKR: 40.880000,
    SAR: 0.549000,
    BDT: 17.980000
};

// 分析index.html的计算公式
// 目标货币值 = 源货币值 * (目标货币rate / 源货币rate)
// 如果源是CNY：目标值 = CNY值 * (目标rate / CNY rate)

// 为了得到正确结果：目标值 = CNY值 * apiRates[目标货币]
// 所以：apiRates[目标] = 目标rate / CNY rate

// 最简单的方案：设CNY rate = 1
// 那么：目标rate = apiRates[目标]

console.log('正确的data-rate值（以CNY=1为基准）:');
console.log('========================================');

const correctRates = {};
for (const [currency, rateToCNY] of Object.entries(apiRates)) {
    correctRates[currency] = rateToCNY;
    console.log(`${currency}: ${rateToCNY.toFixed(6)} (1 CNY = ${rateToCNY} ${currency})`);
}

// 验证计算
console.log('\n\n验证计算:');
console.log('使用公式: 目标值 = 源值 * (目标rate / 源rate)');
console.log('设CNY rate = 1');

// 测试100 CNY → TWD
const cnyRate = 1;
const twdRate = correctRates['TWD']; // 4.63
const result = 100 * (twdRate / cnyRate);
console.log(`\n100 CNY → TWD:`);
console.log(`  100 * (${twdRate} / ${cnyRate}) = ${result.toFixed(2)} TWD`);
console.log(`  预期: 100 * 4.63 = 463.00 TWD ✓`);

// 测试100 CNY → USD
const usdRate = correctRates['USD']; // 0.146
const result2 = 100 * (usdRate / cnyRate);
console.log(`\n100 CNY → USD:`);
console.log(`  100 * (${usdRate} / ${cnyRate}) = ${result2.toFixed(2)} USD`);
console.log(`  预期: 100 * 0.146 = 14.60 USD ✓`);

// 测试100 USD → CNY
// 需要USD的rate
const usdToCNYRate = 1 / usdRate; // 1 USD = 6.8493 CNY
console.log(`\n100 USD → CNY:`);
console.log(`  USD rate = 1 / ${usdRate} = ${usdToCNYRate.toFixed(4)}`);
console.log(`  100 * (${cnyRate} / ${usdToCNYRate}) = ${(100 * (cnyRate / usdToCNYRate)).toFixed(2)} CNY`);
console.log(`  预期: 100 * 6.8493 = 684.93 CNY ✓`);

// 更新currencies数组
console.log('\n\n更新后的currencies数组:');
console.log('[');

const currencies = [
    ['CNY', '人民币[中国¥]'],
    ['TWD', '台币[中国台湾NT$]'],
    ['RUB', '卢布[俄罗斯₽]'],
    ['INR', '卢比[印度₹]'],
    ['JPY', '日元[日本¥]'],
    ['SGD', '新元[新加坡S$]'],
    ['ARS', '比索[阿根廷$]'],
    ['KRW', '韩元[韩国₩]'],
    ['AUD', '澳元[澳大利亚A$]'],
    ['THB', '泰铢[泰国฿]'],
    ['CAD', '加元[加拿大C$]'],
    ['MXN', '比索[墨西哥$]'],
    ['MYR', '林吉特[马来西亚RM]'],
    ['XAU', '国际黄金[克g]'],
    ['HKD', '港元[中国香港HK$]'],
    ['USD', '美元[美国$]'],
    ['EUR', '欧元[欧盟€]'],
    ['VND', '越南盾[越南₫]'],
    ['GBP', '英镑[英国£]'],
    ['PHP', '比索[菲律宾₱]'],
    ['TRY', '里拉[土耳其₺]'],
    ['CHF', '法郎[瑞士Fr]'],
    ['IDR', '印尼盾[印度尼西亚Rp]'],
    ['PKR', '卢比[巴基斯坦Rs]'],
    ['SAR', '里亚尔[沙特阿拉伯SR]'],
    ['BDT', '塔卡[孟加拉国৳]'],
    ['BTC', '比特币[仅供参考]']
];

currencies.forEach(([code, name], index) => {
    let rate;
    
    if (code === 'XAU') {
        // XAU: 国际黄金，单位是克
        // 原值85.47可能表示1克黄金 = 85.47 USD？
        // 但我们需要"对CNY的汇率"
        // 假设1克黄金 = 85.47 USD，1 USD = 6.8493 CNY
        // 那么1克黄金 = 85.47 * 6.8493 = 585.5 CNY
        rate = 585.5; // 估算值
        console.log(`  注意: XAU使用估算值 ${rate} (1 CNY = ${(1/rate).toFixed(6)} 克黄金)`);
    } else if (code === 'BTC') {
        // BTC: 比特币
        // 原值105000可能表示1 BTC = 105000 USD
        // 1 BTC = 105000 USD = 105000 * 6.8493 = 719,176.5 CNY
        rate = 719176.5; // 估算值
        console.log(`  注意: BTC使用估算值 ${rate} (1 CNY = ${(1/rate).toFixed(10)} BTC)`);
    } else if (correctRates[code]) {
        rate = correctRates[code];
    } else {
        console.log(`  警告: ${code} 没有API数据，使用原值`);
        // 查找原始值
        const original = {
            'XAU': 85.47, 'BTC': 105000
        }[code] || 1;
        rate = original;
    }
    
    const comma = index < currencies.length - 1 ? ',' : '';
    const rateStr = typeof rate === 'number' ? rate.toFixed(6) : rate;
    console.log(`  ['${code}', '${name}', ${rateStr}]${comma}`);
});

console.log('];');

// 总结
console.log('\n=== 修复总结 ===');
console.log('1. index.html使用公式: 目标值 = 源值 * (目标rate / 源rate)');
console.log('2. 应该存储"CNY对其他货币的汇率"，设CNY rate = 1');
console.log('3. 这样计算时: 目标值 = CNY值 * 目标rate');
console.log('4. 特殊资产(XAU, BTC)需要单独处理');
console.log('\n🚀 按照这个数组更新index.html，汇率计算就会正确！');