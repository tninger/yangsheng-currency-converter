// 获取当前准确汇率数据
async function getCurrentRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/CNY');
        
        if (!response.ok) {
            throw new Error('无法获取汇率数据');
        }
        
        const data = await response.json();
        const rates = data.rates;
        
        // 关键货币列表（与index.html中一致或相关）
        const keyCurrencies = [
            'CNY', 'USD', 'EUR', 'GBP', 'JPY', 'HKD', 'AUD', 'CAD', 'SGD', 'KRW',
            'TWD', 'RUB', 'INR', 'ARS', 'THB', 'MXN', 'MYR', 'VND', 'PHP', 'TRY',
            'CHF', 'IDR', 'PKR', 'SAR', 'BDT'
        ];
        
        console.log('当前准确汇率数据 (以CNY为基准):');
        console.log('=====================================');
        
        keyCurrencies.forEach(currency => {
            const rate = rates[currency];
            if (rate) {
                console.log(`'${currency}': ${rate.toFixed(6)},`);
            }
        });
        
        // 特别输出USD和EUR，因为它们是基准
        console.log('\n重要汇率对比:');
        console.log(`1 CNY = ${rates['USD'].toFixed(4)} USD (当前)`);
        console.log(`1 CNY = 0.1388 USD (index.html中的旧数据)`);
        console.log(`差异: ${((rates['USD'] - 0.1388) / 0.1388 * 100).toFixed(2)}%`);
        
        console.log(`\n1 CNY = ${rates['EUR'].toFixed(4)} EUR (当前)`);
        console.log(`通过计算EUR对USD: 1 EUR = ${(rates['USD'] / rates['EUR']).toFixed(4)} USD`);
        
        return rates;
        
    } catch (error) {
        console.error('获取汇率失败:', error.message);
        return null;
    }
}

// 计算index.html需要的格式（以USD为基准）
async function calculateUSDBasedRates() {
    const rates = await getCurrentRates();
    if (!rates) return;
    
    console.log('\n\n以USD为基准的汇率（用于index.html的currencies数组）:');
    console.log('===========================================================');
    
    // USD对CNY的汇率
    const usdToCny = 1 / rates['USD'];
    console.log(`USD对CNY: ${usdToCny.toFixed(4)} (1 USD = ${usdToCny.toFixed(4)} CNY)`);
    
    // 计算所有货币对USD的汇率
    const currencies = [
        'CNY', 'TWD', 'RUB', 'INR', 'JPY', 'SGD', 'ARS', 'KRW', 'AUD', 'THB',
        'CAD', 'MXN', 'MYR', 'HKD', 'USD', 'EUR', 'VND', 'GBP', 'PHP', 'TRY',
        'CHF', 'IDR', 'PKR', 'SAR', 'BDT'
    ];
    
    console.log('\n更新后的currencies数组数据:');
    console.log('[');
    
    currencies.forEach(currency => {
        if (currency === 'USD') {
            console.log(`  ['USD', '美元[美国$]', 1],`);
        } else if (rates[currency]) {
            // 计算对USD的汇率：rate = (1 CNY = X currency) => 1 USD = (1/rates['USD']) CNY = (1/rates['USD']) * rates[currency] currency
            const rateToUSD = rates[currency] / rates['USD'];
            console.log(`  ['${currency}', '...', ${rateToUSD.toFixed(4)}],`);
        }
    });
    
    console.log(']');
}

// 执行
calculateUSDBasedRates();