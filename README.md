# 实时天气查询页面

一个简洁美观的实时天气查询页面，支持城市搜索和详细天气信息展示。

## 功能特性

- 🌍 支持全球城市天气查询
- 📱 响应式设计，适配移动端和桌面端
- ⚡ 实时天气数据获取
- 🎨 现代化UI设计，流畅动画效果
- 📊 显示详细天气信息：温度、天气状况、湿度、风速、气压
- 🔍 支持搜索框和回车键快捷搜索

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenWeatherMap API

## 快速开始

### 1. 配置API密钥

1. 访问 [OpenWeatherMap](https://openweathermap.org/api) 注册账号并获取免费API密钥
2. 打开 `script.js` 文件，将 `YOUR_API_KEY` 替换为您的实际API密钥：

```javascript
const API_KEY = 'your_actual_api_key_here';
```

### 2. 运行页面

#### 方法1：直接在浏览器中打开（最简单）

1. 找到 `index.html` 文件
2. 双击文件，或右键选择 "在浏览器中打开"
3. 页面将在您的默认浏览器中加载

#### 方法2：使用Python内置HTTP服务器

如果您的系统已安装Python（推荐Python 3）：

1. 打开终端/命令提示符
2. 导航到项目目录：
   ```bash
   cd /Users/zhangzilong/IdeaProjects/test-agent
   ```
3. 运行以下命令启动服务器：
   ```bash
   python3 -m http.server 8000
   ```
4. 在浏览器中访问：`http://localhost:8000`

#### 方法3：使用VS Code的Live Server扩展

如果您使用VS Code编辑器：

1. 在VS Code中安装 "Live Server" 扩展
2. 在VS Code中打开项目文件夹
3. 右键点击 `index.html` 文件，选择 "Open with Live Server"
4. 页面将自动在浏览器中打开

## 使用说明

1. 在搜索框中输入城市名称（如：北京、上海、London、New York）
2. 点击 "查询" 按钮或按回车键
3. 等待几秒，即可查看该城市的实时天气信息

## 文件结构

```
├── index.html          # 主页面结构
├── style.css           # 样式文件
├── script.js           # JavaScript逻辑
└── README.md           # 说明文档
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 注意事项

- 免费的OpenWeatherMap API有请求次数限制，请合理使用
- 确保您的网络连接正常，能够访问OpenWeatherMap API
- 如果页面显示错误，请检查：
  - API密钥是否正确配置
  - 网络连接是否正常
  - 输入的城市名称是否正确

## 许可证

MIT License