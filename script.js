// 天气API配置 - 使用和风天气API
const QWEATHER_KEY = 'c196f014e30d40168c9f91d53f428f00'; // 用户提供的API KEY
const QWEATHER_GEO_API = 'https://geoapi.qweather.com/v2/city/lookup';
const QWEATHER_NOW_API = 'https://devapi.qweather.com/v7/weather/now';

// DOM元素
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const weatherInfo = document.getElementById('weather-info');
const loading = document.getElementById('loading');
const weatherResult = document.getElementById('weather-result');
const error = document.getElementById('error');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const updateTime = document.getElementById('update-time');
const errorMessage = document.getElementById('error-message');

// 分页相关DOM元素
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageNumbers = document.getElementById('page-numbers');
const pageInfo = document.getElementById('page-info');

// 添加历史天气容器
const historyWeatherContainer = document.createElement('div');
historyWeatherContainer.className = 'history-weather';
historyWeatherContainer.style.display = 'none';
weatherInfo.appendChild(historyWeatherContainer);

// 分页状态管理
let currentPage = 1;
let totalPages = 1;
let allHistoryData = [];
const itemsPerPage = 5;

// 事件监听器
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

// 获取天气数据
async function getWeather(city) {
    // 显示加载状态
    showLoading();
    
    try {
        console.log('开始获取天气数据，城市:', city);
        
        // 获取日期选择
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        
        // 1. 先通过和风天气地理编码API获取城市的locationId
        console.log('调用和风天气地理编码API:', `${QWEATHER_GEO_API}?location=${encodeURIComponent(city)}&key=${QWEATHER_KEY}&number=1&lang=zh`);
        const geoResponse = await fetch(`${QWEATHER_GEO_API}?location=${encodeURIComponent(city)}&key=${QWEATHER_KEY}&number=1&lang=zh`);
        
        if (!geoResponse.ok) {
            throw new Error(`获取城市信息失败，状态码: ${geoResponse.status}`);
        }
        
        const geoData = await geoResponse.json();
        console.log('和风天气地理编码API响应数据:', geoData);
        
        if (geoData.code !== '200' || !geoData.location || geoData.location.length === 0) {
            throw new Error('城市未找到，请检查输入');
        }
        
        const locationId = geoData.location[0].id;
        const cityName = geoData.location[0].name;
        const country = geoData.location[0].country;
        
        // 2. 根据日期选择决定查询实时天气还是历史天气
        if (startDate && endDate) {
            // 查询历史天气
            await getHistoryWeather(locationId, cityName, country, startDate, endDate);
        } else {
            // 查询实时天气
            await getCurrentWeather(locationId, cityName, country);
        }
        
    } catch (err) {
        // 显示错误信息
        console.error('获取天气数据失败:', err);
        showError(err.message);
    }
}

// 获取实时天气
async function getCurrentWeather(locationId, cityName, country) {
    console.log('调用和风天气实时天气API:', `${QWEATHER_NOW_API}?key=${QWEATHER_KEY}&location=${locationId}`);
    const weatherResponse = await fetch(`${QWEATHER_NOW_API}?key=${QWEATHER_KEY}&location=${locationId}`);
    
    if (!weatherResponse.ok) {
        throw new Error(`获取天气数据失败，状态码: ${weatherResponse.status}`);
    }
    
    const weatherData = await weatherResponse.json();
    console.log('和风天气实时天气API响应数据:', weatherData);
    
    if (weatherData.code !== '200') {
        throw new Error(`获取天气数据失败: ${weatherData.code}`);
    }
    
    const now = weatherData.now;
    
    // 整合数据，适配原有的displayWeather函数
    const data = {
        name: cityName,
        sys: { country: country },
        weather: [{ 
            description: now.text, // 天气状况
            icon: getQWeatherIcon(now.icon) // 天气图标
        }],
        main: {
            temp: parseFloat(now.temp), // 温度
            humidity: parseInt(now.humidity), // 湿度
            pressure: parseInt(now.pressure) // 气压
        },
        wind: {
            speed: parseFloat(now.windSpeed) // 风速
        }
    };
    
    // 显示实时天气结果
    displayCurrentWeather(data);
}

// 获取历史天气
async function getHistoryWeather(locationId, cityName, country, startDate, endDate) {
    // 注意：和风天气历史天气API需要商业版，这里使用模拟数据
    console.log('查询历史天气，日期范围:', startDate, '到', endDate);
    
    // 模拟历史天气数据
    const mockHistoryData = generateMockHistoryWeather(startDate, endDate);
    
    // 显示历史天气结果
    displayHistoryWeather(cityName, country, mockHistoryData);
}

// 生成模拟历史天气数据
function generateMockHistoryWeather(startDate, endDate) {
    const historyData = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // 天气状况列表
    const weatherConditions = [
        { text: '晴', icon: '01d', temp: 15, humidity: 40, windSpeed: 2.5, pressure: 1013 },
        { text: '多云', icon: '02d', temp: 13, humidity: 50, windSpeed: 3.0, pressure: 1012 },
        { text: '阴', icon: '03d', temp: 12, humidity: 60, windSpeed: 2.0, pressure: 1011 },
        { text: '小雨', icon: '10d', temp: 10, humidity: 70, windSpeed: 1.5, pressure: 1009 },
        { text: '中雨', icon: '10d', temp: 9, humidity: 80, windSpeed: 2.0, pressure: 1008 }
    ];
    
    // 生成每天的天气数据
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        historyData.push({
            date: date.toISOString().split('T')[0],
            text: randomWeather.text,
            icon: randomWeather.icon,
            temp: randomWeather.temp,
            humidity: randomWeather.humidity,
            windSpeed: randomWeather.windSpeed,
            pressure: randomWeather.pressure
        });
    }
    
    return historyData;
}

// 显示实时天气结果
function displayCurrentWeather(data) {
    // 隐藏历史天气容器
    historyWeatherContainer.style.display = 'none';
    
    // 更新城市名称
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    // 更新天气图标
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // 更新温度
    temp.textContent = Math.round(data.main.temp);
    
    // 更新天气描述
    description.textContent = data.weather[0].description;
    
    // 更新湿度
    humidity.textContent = data.main.humidity;
    
    // 更新风速
    windSpeed.textContent = data.wind.speed.toFixed(1);
    
    // 更新气压
    pressure.textContent = data.main.pressure;
    
    // 更新时间
    const now = new Date();
    updateTime.textContent = now.toLocaleString('zh-CN');
    
    // 显示结果，隐藏其他状态
    loading.style.display = 'none';
    error.style.display = 'none';
    weatherResult.style.display = 'block';
}

// 显示历史天气结果
function displayHistoryWeather(cityName, country, historyData) {
    // 隐藏实时天气结果
    weatherResult.style.display = 'none';
    
    // 保存完整的历史数据
    allHistoryData = historyData;
    
    // 计算总页数
    totalPages = Math.ceil(allHistoryData.length / itemsPerPage);
    currentPage = 1; // 重置为第一页
    
    // 显示第一页数据
    showHistoryPage(cityName, country);
    
    // 显示分页控件（如果需要）
    if (totalPages > 1) {
        showPagination();
        updatePagination();
    } else {
        hidePagination();
    }
    
    // 显示结果，隐藏其他状态
    loading.style.display = 'none';
    error.style.display = 'none';
    historyWeatherContainer.style.display = 'block';
}

// 显示指定页的历史天气数据
function showHistoryPage(cityName, country) {
    // 计算当前页的数据范围
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = allHistoryData.slice(startIndex, endIndex);
    
    // 构建历史天气HTML
    let historyHtml = `
        <h2>${cityName}, ${country} 历史天气</h2>
        <div class="history-weather-list">
    `;
    
    currentPageData.forEach(day => {
        historyHtml += `
            <div class="history-weather-item">
                <div class="history-date">${day.date}</div>
                <div class="history-weather-info">
                    <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.text}" class="history-weather-icon">
                    <div class="history-weather-desc">${day.text}</div>
                </div>
                <div class="history-temp">${day.temp}°C</div>
                <div class="history-details">
                    <div class="history-detail-item">
                        <div class="history-detail-label">湿度</div>
                        <div class="history-detail-value">${day.humidity}%</div>
                    </div>
                    <div class="history-detail-item">
                        <div class="history-detail-label">风速</div>
                        <div class="history-detail-value">${day.windSpeed}m/s</div>
                    </div>
                    <div class="history-detail-item">
                        <div class="history-detail-label">气压</div>
                        <div class="history-detail-value">${day.pressure}hPa</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    historyHtml += `</div>`;
    
    // 更新历史天气容器
    historyWeatherContainer.innerHTML = historyHtml;
}

// 显示分页控件
function showPagination() {
    pagination.style.display = 'flex';
}

// 隐藏分页控件
function hidePagination() {
    pagination.style.display = 'none';
}

// 更新分页控件状态
function updatePagination() {
    // 更新页码
    generatePageNumbers();
    
    // 更新页码信息
    pageInfo.textContent = `共 ${allHistoryData.length} 条，第 ${currentPage}/${totalPages} 页`;
    
    // 更新按钮状态
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// 生成页码
function generatePageNumbers() {
    pageNumbers.innerHTML = '';
    
    // 显示的页码数量
    const maxVisiblePages = 5;
    
    // 计算显示的起始页码
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // 调整起始页码，确保显示完整的页码范围
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // 添加页码
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            goToPage(i);
        });
        pageNumbers.appendChild(pageBtn);
    }
}

// 跳转到指定页
function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    
    // 从城市名称中提取城市和国家信息
    const title = historyWeatherContainer.querySelector('h2').textContent;
    const match = title.match(/(.*),\s*(.*)\s*历史天气/);
    if (match) {
        const [, cityName, country] = match;
        showHistoryPage(cityName, country);
        updatePagination();
    }
}

// 上一页
function prevPage() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

// 下一页
function nextPage() {
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

// 添加分页按钮事件监听器
prevBtn.addEventListener('click', prevPage);
nextBtn.addEventListener('click', nextPage);

// 重置分页状态
function resetPagination() {
    currentPage = 1;
    totalPages = 1;
    allHistoryData = [];
    hidePagination();
}

// 根据和风天气图标代码获取天气图标
function getQWeatherIcon(iconCode) {
    // 和风天气图标映射到OpenWeatherMap图标
    const iconMap = {
        '100': '01d', // 晴
        '101': '02d', // 多云
        '102': '03d', // 少云
        '103': '03d', // 晴间多云
        '104': '04d', // 阴
        '200': '11d', // 雷阵雨
        '201': '11d', // 雷阵雨伴有冰雹
        '202': '11d', // 强雷阵雨
        '203': '11d', // 强雷阵雨伴有冰雹
        '204': '11d', // 雷阵雨伴有大风
        '205': '09d', // 小雨
        '206': '10d', // 中雨
        '207': '10d', // 大雨
        '208': '10d', // 极端降雨
        '209': '09d', // 阵雨
        '210': '10d', // 强阵雨
        '211': '10d', // 极端阵雨
        '212': '10d', // 强阵雨
        '213': '09d', // 阵雨
        '300': '09d', // 毛毛雨
        '301': '09d', // 细雨
        '302': '10d', // 中雨
        '303': '10d', // 大雨
        '304': '10d', // 极端降雨
        '305': '09d', // 暴雨
        '306': '10d', // 大暴雨
        '307': '10d', // 特大暴雨
        '308': '10d', // 极端降雨
        '309': '09d', // 强毛毛雨
        '310': '10d', // 强细雨
        '311': '10d', // 强中雨
        '312': '10d', // 强大雨
        '313': '10d', // 强极端降雨
        '314': '10d', // 强暴雨
        '315': '10d', // 强大暴雨
        '316': '10d', // 强特大暴雨
        '317': '10d', // 强极端降雨
        '318': '10d', // 强降雨
        '400': '13d', // 小雪
        '401': '13d', // 中雪
        '402': '13d', // 大雪
        '403': '13d', // 暴雪
        '404': '13d', // 雨夹雪
        '405': '13d', // 雨雪天气
        '406': '13d', // 阵雨夹雪
        '407': '13d', // 阵雪
        '500': '50d', // 薄雾
        '501': '50d', // 雾
        '502': '50d', // 霾
        '503': '50d', // 中度霾
        '504': '50d', // 重度霾
        '505': '50d', // 严重霾
        '506': '50d', // 大雾
        '507': '50d', // 浓雾
        '508': '50d', // 强浓雾
        '509': '50d', // 强浓雾
        '510': '50d', // 特强浓雾
        '511': '50d', // 浓雾
        '512': '50d', // 强浓雾
        '513': '50d', // 特强浓雾
        '514': '50d', // 强浓雾
        '515': '50d', // 浓雾
        '900': '11d', // 热
        '901': '11d', // 冷
        '999': '01d'  // 未知
    };
    
    return iconMap[iconCode] || '01d'; // 默认晴天
}

// 显示加载状态
function showLoading() {
    weatherResult.style.display = 'none';
    error.style.display = 'none';
    historyWeatherContainer.style.display = 'none';
    hidePagination(); // 隐藏分页控件
    resetPagination(); // 重置分页状态
    loading.style.display = 'block';
}

// 显示天气结果
function displayWeather(data) {
    // 更新城市名称
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    // 更新天气图标
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // 更新温度
    temp.textContent = Math.round(data.main.temp);
    
    // 更新天气描述
    description.textContent = data.weather[0].description;
    
    // 更新湿度
    humidity.textContent = data.main.humidity;
    
    // 更新风速
    windSpeed.textContent = data.wind.speed;
    
    // 更新气压
    pressure.textContent = data.main.pressure;
    
    // 更新时间
    const now = new Date();
    updateTime.textContent = now.toLocaleString('zh-CN');
    
    // 显示结果，隐藏其他状态
    loading.style.display = 'none';
    error.style.display = 'none';
    weatherResult.style.display = 'block';
}

// 显示错误信息
function showError(message) {
    errorMessage.textContent = message;
    loading.style.display = 'none';
    weatherResult.style.display = 'none';
    error.style.display = 'block';
}

// 初始化页面 - 默认显示北京天气
window.addEventListener('DOMContentLoaded', () => {
    getWeather('北京');
});