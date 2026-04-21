// 重新计算正确的汇率数据格式
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

// 计算：对USD的汇率
// 如果 1 CNY = rate_CNY USD (0.146)
// 那么 1 其他货币 = (1/rate_other_CNY) * rate_CNY USD
function calculateUSDRate(currency) {
    if (currency === 'USD') return 1;
    if (currency === 'CNY') return apiRates['USD']; // 1 CNY = 0.146 USD
    
    const rateToCNY = apiRates[currency]; // 1 CNY = X currency
    // 1 currency = 1/X CNY
    // 1 CNY = 0.146 USD
    // 所以 1 currency = (1/X) * 0.146 USD
    return (1 / rateToCNY) * apiRates['USD'];
}

console.log('正确的汇率数据（对USD的汇率）:');
console.log('==================================');

const usdRates = {};
for (const [currency, rateToCNY] of Object.entries(apiRates)) {
    const usdRate = calculateUSDRate(currency);
    usdRates[currency] = usdRate;
    console.log(`${currency}: ${usdRate.toFixed(6)} (1 ${currency} = ${usdRate.toFixed(6)} USD)`);
}

// 验证计算
console.log('\n\n验证计算:');
console.log('100 CNY 应该等于多少 TWD?');

const cnyRate = usdRates['CNY']; // 0.146
const twdRate = usdRates['TWD']; // 计算值

console.log(`CNY rate: ${cnyRate}`);
console.log(`TWD rate: ${twdRate}`);

// 100 CNY = ? USD
const usdAmount = 100 / cnyRate; // 100 / 0.146
console.log(`100 CNY = ${usdAmount.toFixed(2)} USD`);

// ? USD = ? TWD
const twdAmount = usdAmount * twdRate;
console.log(`${usdAmount.toFixed(2)} USD = ${twdAmount.toFixed(2)} TWD`);

// 直接公式：100 CNY = 100 * (TWD rate / CNY rate)
const directAmount = 100 * (twdRate / cnyRate);
console.log(`直接计算: 100 * (${twdRate}/${cnyRate}) = ${directAmount.toFixed(2)} TWD`);

// 预期：根据API，1 CNY = 4.63 TWD，所以100 CNY = 463 TWD
const expected = 100 * apiRates['TWD'];
console.log(`预期结果: 100 * ${apiRates['TWD']} = ${expected.toFixed(2)} TWD`);

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
    
    if (code === 'XAU' || code === 'BTC') {
        // 特殊资产，保持原值但需要调整
        // 原值：XAU: 85.47 (这可能是1 XAU = 85.47 USD)
        // 原值：BTC: 105000 (这可能是1 BTC = 105000 USD)
        // 所以保持不变
        if (code === 'XAU') rate = 85.47;
        if (code === 'BTC') rate = 105000;
    } else if (usdRates[code]) {
        rate = usdRates[code];
    } else {
        console.log(`警告: ${code} 没有API数据`);
        rate = 0;
    }
    
    const comma = index < currencies.length - 1 ? ',' : '';
    console.log(`  ['${code}', '${name}', ${rate.toFixed(6)}]${comma}`);
});

console.log('];');

// 测试用户看到的数据
console.log('\n\n验证用户看到的数据:');
console.log('如果CNY=0.1388, TWD=0.0306 (原始错误数据)');
const oldCNY = 0.1388;
const oldTWD = 0.0306;
const oldResult = 100 * (oldTWD / oldCNY);
console.log(`100 * (${oldTWD}/${oldCNY}) = ${oldResult.toFixed(2)} TWD`);
console.log(`用户看到: 22.05 TWD ✓`);

console.log('\n使用修正后的数据:');
const newCNY = usdRates['CNY'];
const newTWD = usdRates['TWD'];
const newResult = 100 * (newTWD / newCNY);
console.log(`100 * (${newTWD.toFixed(6)}/${newCNY.toFixed(6)}) = ${newResult.toFixed(2)} TWD`);
console.log(`正确结果: ${(100 * apiRates['TWD']).toFixed(2)} TWD`);