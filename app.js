class CurrencyConverter {
    constructor() {
        this.rates = {};
        this.lastUpdated = null;
        this.baseCurrency = 'CNY';
        
        // DOM元素
        this.fromAmount = document.getElementById('fromAmount');
        this.fromCurrency = document.getElementById('fromCurrency');
        this.toAmount = document.getElementById('toAmount');
        this.toCurrency = document.getElementById('toCurrency');
        this.resultAmount = document.getElementById('resultAmount');
        this.resultCurrency = document.getElementById('resultCurrency');
        this.exchangeRate = document.getElementById('exchangeRate');
        this.lastUpdatedEl = document.getElementById('lastUpdated');
        this.loading = document.getElementById('loading');
        this.errorMessage = document.getElementById('errorMessage');
        
        // 按钮
        this.convertBtn = document.getElementById('convertBtn');
        this.swapBtn = document.getElementById('swapBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        await this.fetchExchangeRates();
        this.convert();
    }
    
    setupEventListeners() {
        // 输入框变化事件
        this.fromAmount.addEventListener('input', () => this.convert());
        this.fromCurrency.addEventListener('change', () => this.convert());
        this.toCurrency.addEventListener('change', () => this.convert());
        
        // 按钮事件
        this.convertBtn.addEventListener('click', () => this.convert());
        this.swapBtn.addEventListener('click', () => this.swapCurrencies());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // 金额输入框回车事件
        this.fromAmount.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.convert();
            }
        });
    }
    
    async fetchExchangeRates() {
        this.showLoading();
        this.hideError();
        
        try {
            // 使用免费的汇率API (ExchangeRate-API)
            // 注意：在实际部署时，建议使用自己的API密钥
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/CNY');
            
            if (!response.ok) {
                throw new Error('无法获取汇率数据');
            }
            
            const data = await response.json();
            this.rates = data.rates;
            this.lastUpdated = new Date(data.date + 'T00:00:00Z');
            this.updateLastUpdated();
            
            // 如果API失败，使用预设的汇率数据
            if (!this.rates || Object.keys(this.rates).length === 0) {
                this.useFallbackRates();
            }
            
        } catch (error) {
            console.warn('使用备用汇率数据:', error.message);
            this.useFallbackRates();
            this.showError('使用备用汇率数据，可能不是最新');
        } finally {
            this.hideLoading();
        }
    }
    
    useFallbackRates() {
        // 预设的汇率数据 (作为备用) - 更新于2026-04-21
        this.rates = {
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
        this.lastUpdated = new Date();
        this.updateLastUpdated();
    }
    
    convert() {
        const amount = parseFloat(this.fromAmount.value) || 0;
        const fromCurrency = this.fromCurrency.value;
        const toCurrency = this.toCurrency.value;
        
        if (amount <= 0) {
            this.toAmount.value = '0.00';
            this.resultAmount.textContent = '0.00';
            this.resultCurrency.textContent = this.getCurrencyName(toCurrency);
            this.exchangeRate.textContent = `汇率: 1 ${fromCurrency} = 0.000 ${toCurrency}`;
            return;
        }
        
        // 计算汇率
        let rate = 1;
        if (fromCurrency === toCurrency) {
            rate = 1;
        } else {
            const fromRate = this.rates[fromCurrency];
            const toRate = this.rates[toCurrency];
            
            if (fromRate && toRate) {
                rate = toRate / fromRate;
            } else {
                this.showError('汇率数据不完整');
                return;
            }
        }
        
        // 计算转换结果
        const convertedAmount = amount * rate;
        
        // 格式化显示
        this.toAmount.value = this.formatNumber(convertedAmount, 2);
        this.resultAmount.textContent = this.formatNumber(convertedAmount, 2);
        this.resultCurrency.textContent = this.getCurrencyName(toCurrency);
        this.exchangeRate.textContent = `汇率: 1 ${fromCurrency} = ${this.formatNumber(rate, 4)} ${toCurrency}`;
    }
    
    swapCurrencies() {
        const fromCurrency = this.fromCurrency.value;
        const toCurrency = this.toCurrency.value;
        
        // 交换货币
        this.fromCurrency.value = toCurrency;
        this.toCurrency.value = fromCurrency;
        
        // 交换金额
        const currentAmount = this.toAmount.value;
        this.fromAmount.value = currentAmount || '100';
        
        // 重新计算
        this.convert();
        
        // 动画效果
        this.swapBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.swapBtn.style.transform = '';
        }, 300);
    }
    
    reset() {
        this.fromAmount.value = '100';
        this.fromCurrency.value = 'CNY';
        this.toCurrency.value = 'USD';
        this.convert();
        
        // 动画效果
        this.resetBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.resetBtn.style.transform = '';
        }, 300);
    }
    
    formatNumber(number, decimals = 2) {
        return number.toLocaleString('zh-CN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }
    
    getCurrencyName(code) {
        const currencyNames = {
            CNY: '人民币',
            USD: '美元',
            EUR: '欧元',
            GBP: '英镑',
            JPY: '日元',
            HKD: '港币',
            AUD: '澳元',
            CAD: '加元',
            SGD: '新加坡元',
            KRW: '韩元'
        };
        return currencyNames[code] || code;
    }
    
    updateLastUpdated() {
        if (this.lastUpdated) {
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            };
            const dateStr = this.lastUpdated.toLocaleDateString('zh-CN', options);
            this.lastUpdatedEl.textContent = `最后更新: ${dateStr}`;
        }
    }
    
    showLoading() {
        this.loading.classList.add('active');
    }
    
    hideLoading() {
        this.loading.classList.remove('active');
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('active');
    }
    
    hideError() {
        this.errorMessage.classList.remove('active');
    }
    
    // 手动更新汇率
    async refreshRates() {
        await this.fetchExchangeRates();
        this.convert();
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const converter = new CurrencyConverter();
    
    // 暴露全局对象以便调试
    window.converter = converter;
    
    // 每5分钟自动更新一次汇率
    setInterval(() => {
        converter.fetchExchangeRates().then(() => {
            converter.convert();
        });
    }, 5 * 60 * 1000);
    
    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            converter.refreshRates();
        }
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            converter.swapCurrencies();
        }
        if (e.key === 'Escape') {
            converter.reset();
        }
    });
});