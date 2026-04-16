// 修改后的JavaScript逻辑，让人民币也显示
const exchangeRates = {
    CNY: { name: '人民币', rate: 1, flag: '🇨🇳' },
    USD: { name: '美元', rate: 0.140, flag: '🇺🇸' },
    EUR: { name: '欧元', rate: 0.127, flag: '🇪🇺' },
    GBP: { name: '英镑', rate: 0.109, flag: '🇬🇧' },
    JPY: { name: '日元', rate: 20.5, flag: '🇯🇵' },
    HKD: { name: '港币', rate: 1.08, flag: '🇭🇰' },
    AUD: { name: '澳元', rate: 0.208, flag: '🇦🇺' },
    CAD: { name: '加元', rate: 0.186, flag: '🇨🇦' },
    SGD: { name: '新加坡元', rate: 0.185, flag:🇸🇬},
    KRW: { name: '韩元', rate: 180.5, flag: '🇰🇷' }
};

// 目标货币列表 - 包含人民币
const targetCurrencies = ['CNY', 'USD', 'EUR', 'GBP', 'JPY', 'HKD', 'AUD', 'CAD', 'SGD', 'KRW'];

// 计算多币种汇率，包括人民币
function calculateMultiCurrency() {
    const baseAmountValue = parseFloat(baseAmount.value) || 0;
    const baseCurrencyCode = baseCurrency.value;
    const baseRate = exchangeRates[baseCurrencyCode].rate;
    
    // 清空当前网格
    currencyGrid.innerHTML = '';
    
    // 为每个目标货币创建卡片，包括人民币
    targetCurrencies.forEach(targetCode => {
        if (targetCode === baseCurrencyCode) {
            // 如果目标货币和基准货币相同，显示1:1汇率
            const rate = 1; // 人民币对人民币汇率为1
            const convertedAmount = baseAmountValue * rate;
            
            // 创建货币卡片
            const card = document.createElement('div');
            card.className = 'currency-card';
            
            // 计算其他常见金额
            const amount100 = 100 * rate;
            const amount500 = 500 * rate;
            const amount1000 = 1000 * rate;
            const amount5000 = 5000 * rate;
            
            card.innerHTML = `
                <div class="currency-header">
                    <div class="currency-flag">${exchangeRates[targetCode].flag}</div>
                    <div class="currency-info">
                        <div class="currency-code">${targetCode}</div>
                        <div class="currency-name">${exchangeRates[targetCode].name}</div>
                    </div>
                </div>
                
                <div class="rate-display">
                    <div class="rate-amount">${formatNumber(rate, 4)}</div>
                    <div class="rate-label">1 ${baseCurrencyCode} = ${rate.toFixed(4)} ${targetCode}</div>
                </div>
                
                <div class="converted-amounts">
                    <div class="amount-item">
                        <div class="amount-value">${formatNumber(convertedAmount, 2)} ${targetCode}</div>
                        <div class="amount-label">${baseAmountValue} ${baseCurrencyCode}</div>
                    </div>
                    <div class="amount-item">
                        <div class="amount-value">${formatNumber(amount100, 2)} ${targetCode}</div>
                        <div class="amount-label">100 ${baseCurrencyCode}</div>
                    </div>
                    <div class="amount-item">
                        <div class="amount-value">${formatNumber(amount500, 2)} ${targetCode}</div>
                        <div class="amount-label">500 ${baseCurrencyCode}</div>
                    </div>
                    <div class="amount-item">
                        <div class="amount-value">${formatNumber(amount1000, 2)} ${targetCode}</div>
                        <div class="amount-label">1000 ${baseCurrencyCode}</div>
                    </div>
                </div>
            `;
            
            currencyGrid.appendChild(card);
        } else {
            // 其他货币正常计算
            const targetRate = exchangeRates[targetCode].rate;
            const rate = targetRate / baseRate;
            const convertedAmount = baseAmountValue * rate;
            
            // ... 其他货币的卡片创建代码
        }
    });
    
    // 更新时间
    updateLastUpdated();
}

// 更新后重新加载
calculateMultiCurrency();
