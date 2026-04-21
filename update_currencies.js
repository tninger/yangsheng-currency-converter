// 更新index.html中的currencies数组
const fs = require('fs');
const path = require('path');

// 当前准确汇率数据（来自API测试）
const currentRates = {
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

// 计算对USD的汇率
function calculateUSDBaseRates() {
    const usdRate = currentRates['USD']; // 1 CNY = 0.146 USD
    const usdBasedRates = {};
    
    for (const [currency, rate] of Object.entries(currentRates)) {
        // rate是 1 CNY = X currency
        // 我们需要 1 USD = Y currency
        // Y = rate / usdRate
        usdBasedRates[currency] = rate / usdRate;
    }
    
    return usdBasedRates;
}

// 原始currencies数组（来自index.html）
const originalCurrencies = [
    ['CNY', '人民币[中国¥]', 0.1388],
    ['TWD', '台币[中国台湾NT$]', 0.0306],
    ['RUB', '卢布[俄罗斯₽]', 0.0109],
    ['INR', '卢比[印度₹]', 0.0117],
    ['JPY', '日元[日本¥]', 0.0065],
    ['SGD', '新元[新加坡S$]', 0.744],
    ['ARS', '比索[阿根廷$]', 0.001],
    ['KRW', '韩元[韩国₩]', 0.0007],
    ['AUD', '澳元[澳大利亚A$]', 0.626],
    ['THB', '泰铢[泰国฿]', 0.0296],
    ['CAD', '加元[加拿大C$]', 0.694],
    ['MXN', '比索[墨西哥$]', 0.0494],
    ['MYR', '林吉特[马来西亚RM]', 0.224],
    ['XAU', '国际黄金[克g]', 85.47],
    ['HKD', '港元[中国香港HK$]', 0.128],
    ['USD', '美元[美国$]', 1],
    ['EUR', '欧元[欧盟€]', 1.049],
    ['VND', '越南盾[越南₫]', 0.00004],
    ['GBP', '英镑[英国£]', 1.262],
    ['PHP', '比索[菲律宾₱]', 0.0171],
    ['TRY', '里拉[土耳其₺]', 0.0287],
    ['CHF', '法郎[瑞士Fr]', 1.13],
    ['IDR', '印尼盾[印度尼西亚Rp]', 0.00006],
    ['PKR', '卢比[巴基斯坦Rs]', 0.0036],
    ['SAR', '里亚尔[沙特阿拉伯SR]', 0.267],
    ['BDT', '塔卡[孟加拉国৳]', 0.0083],
    ['BTC', '比特币[仅供参考]', 105000]
];

// 计算新的汇率数据
const usdBasedRates = calculateUSDBaseRates();
console.log('以USD为基准的汇率:');
console.log('===================');
for (const [currency, rate] of Object.entries(usdBasedRates)) {
    console.log(`${currency}: ${rate.toFixed(6)}`);
}

// 更新currencies数组
const updatedCurrencies = originalCurrencies.map(item => {
    const [code, name] = item;
    
    // 特殊处理：BTC和XAU没有API数据，保持原样
    if (code === 'BTC' || code === 'XAU') {
        console.log(`保持 ${code} 汇率不变: ${item[2]}`);
        return item;
    }
    
    if (usdBasedRates[code]) {
        const newRate = usdBasedRates[code];
        console.log(`更新 ${code}: ${item[2]} -> ${newRate.toFixed(6)}`);
        return [code, name, newRate];
    } else {
        console.log(`警告: ${code} 没有当前汇率数据，保持原样`);
        return item;
    }
});

// 验证更新
console.log('\n\n更新后的currencies数组:');
console.log('[');
updatedCurrencies.forEach(item => {
    const [code, name, rate] = item;
    console.log(`  ['${code}', '${name}', ${typeof rate === 'number' ? rate.toFixed(6) : rate}],`);
});
console.log(']');

// 计算一些关键货币的差异
console.log('\n\n关键货币汇率对比:');
const keyCurrencies = ['CNY', 'USD', 'EUR', 'GBP', 'JPY', 'HKD'];
keyCurrencies.forEach(code => {
    const original = originalCurrencies.find(item => item[0] === code);
    const updated = updatedCurrencies.find(item => item[0] === code);
    
    if (original && updated) {
        const diff = updated[2] - original[2];
        const diffPercent = (diff / original[2] * 100).toFixed(2);
        console.log(`${code}: ${original[2]} -> ${updated[2].toFixed(6)} (变化: ${diffPercent}%)`);
    }
});

// 生成更新index.html的脚本
console.log('\n\n要更新index.html，请替换currencies数组为以下内容:');
console.log('\n---------------------------------------------');
console.log('        const currencies = [');
updatedCurrencies.forEach(([code, name, rate], index) => {
    const rateStr = typeof rate === 'number' ? rate.toFixed(6) : rate;
    const comma = index < updatedCurrencies.length - 1 ? ',' : '';
    console.log(`            ['${code}', '${name}', ${rateStr}]${comma}`);
});
console.log('        ];');
console.log('---------------------------------------------\n');

// 注意：由于BTC和XAU是特殊资产类，需要单独处理
console.log('注意:');
console.log('- BTC (比特币) 和 XAU (黄金) 是特殊资产类，没有标准汇率API数据');
console.log('- 建议手动更新这些值或使用专门的API');
console.log('- 其他货币已更新为当前准确汇率');