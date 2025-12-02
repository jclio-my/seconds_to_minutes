# Web2Executable 打包时间转换器为 EXE 完整指南

## 📋 什么是 Web2Executable？

Web2Executable 是一个用户友好的图形界面工具，可以将网页应用转换为独立的桌面应用程序（EXE 文件）。相比命令行工具，它提供了直观的界面配置选项。

## 🎯 优势对比

| 特性 | Web2Executable | Nativefier |
|------|----------------|------------|
| 使用方式 | 图形界面 | 命令行 |
| 易用性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 自定义程度 | 中等 | 高 |
| 跨平台支持 | Windows 为主 | 全平台 |
| 适合用户 | 新手、快速打包 | 开发者、高级定制 |

## 📥 下载和安装

### 官方下载
1. 访问官网：https://web2exe.com/
2. 下载最新版本的 Web2Executable
3. 安装软件（Windows 系统）

### 替代下载源
- GitHub Releases：https://github.com/parshap/node-webkit-builder/releases
- 软件下载站：搜索 "Web2Executable download"

## 🔧 使用步骤

### 第一步：准备项目文件
确保您已经构建好了网页项目：
```bash
npm run build
```

构建完成后，您应该有 `dist/` 目录，包含：
- `index.html`
- `assets/` 文件夹
- 其他静态资源

### 第二步：启动 Web2Executable
1. 打开 Web2Executable 应用
2. 您会看到一个简洁的图形界面

### 第三步：配置应用信息

#### 基本设置
1. **Application Name**：`时间转换器`
2. **Package Name**：`time-converter`
3. **Version**：`1.0.0`
4. **Description**：`一个简单的时间转换工具`
5. **Copyright**：`时间转换器版权所有`

#### 文件设置
1. **Source Folder**：选择您的 `dist/` 目录
2. **Main File**：选择 `index.html`
3. **Output Folder**：选择输出目录（如 `D:\output`）

#### 窗口设置
1. **Width**：`1200`
2. **Height**：`800`
3. **Min Width**：`800`
4. **Min Height**：`600`
5. **Resizable**：✅ 勾选
6. **Frame**：✅ 勾选（显示窗口边框）
7. **Show in Taskbar**：✅ 勾选

#### 高级设置
1. **Single Instance**：✅ 勾选（防止多开）
2. **Kiosk Mode**：❌ 不勾选
3. **Full Screen**：❌ 不勾选
4. **Always on Top**：❌ 不勾选
5. **Show Menu Bar**：❌ 不勾选
6. **Enable Developer Tools**：❌ 不勾选

#### 图标设置
1. **Icon File**：选择一个 `.ico` 格式的图标文件
   - 推荐尺寸：256x256 像素
   - 可以使用在线工具将 PNG 转换为 ICO

#### 压缩设置
1. **Compression Level**：选择 `Normal` 或 `High`
2. **Include Node Modules**：❌ 不勾选（纯前端项目不需要）

### 第四步：构建应用
1. 点击 **"Build"** 或 **"Package"** 按钮
2. 等待构建完成（可能需要几分钟）
3. 构建完成后，在输出目录中找到 EXE 文件

## 📁 生成的文件结构

```
output/
├── 时间转换器.exe          # 主执行文件
├── 时间转换器.exe.config   # 配置文件
├── nw.pak                 # NW.js 运行时文件
├── locales/                # 语言包
├── ...                     # 其他运行时文件
```

## 🚀 测试和分发

### 测试应用
1. 双击生成的 EXE 文件
2. 确认应用正常启动
3. 测试所有功能是否正常工作
4. 检查窗口大小和样式是否符合预期

### 分发方式
1. **简单分发**：
   - 将整个输出文件夹压缩为 ZIP
   - 用户解压后运行 EXE 文件

2. **安装包制作**：
   - 使用 Inno Setup 创建专业安装程序
   - 可以添加桌面快捷方式和开始菜单项

## 🔧 高级配置

### 自定义脚本
如果需要特殊功能，可以在项目中添加 JavaScript 文件：

```javascript
// custom.js
// 窗口加载完成后的自定义逻辑
window.onload = function() {
    // 禁用右键菜单
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // 其他自定义逻辑
};
```

然后在 HTML 中引用：
```html
<script src="custom.js"></script>
```

### 环境变量
Web2Executable 支持一些特殊的环境变量：
- `nw-argv`：命令行参数
- `nw-flavor`：运行时版本

## 🐛 常见问题解决

### 1. 应用无法启动
- **原因**：缺少运行时文件
- **解决**：确保整个输出文件夹完整，不要只复制 EXE 文件

### 2. 图标不显示
- **原因**：图标格式或尺寸不正确
- **解决**：使用标准的 ICO 格式，推荐 256x256 像素

### 3. 窗口大小异常
- **原因**：CSS 样式与窗口设置冲突
- **解决**：检查 CSS 中的 width/height 设置，避免使用 100%

### 4. 文件路径问题
- **原因**：相对路径在打包后失效
- **解决**：使用绝对路径或相对于 HTML 文件的路径

## 📊 性能优化建议

1. **减小文件大小**：
   - 压缩图片资源
   - 移除不必要的依赖
   - 启用 Gzip 压缩

2. **启动速度优化**：
   - 减少 JavaScript 文件大小
   - 优化 CSS 加载顺序
   - 避免同步请求

3. **内存使用优化**：
   - 及时清理事件监听器
   - 避免内存泄漏
   - 合理使用缓存

## 🎉 与 Nativefier 的选择建议

### 选择 Web2Executable 的情况：
- 您是新手，不熟悉命令行
- 需要快速打包，不想学习复杂参数
- 主要在 Windows 平台使用
- 需要图形界面的直观操作

### 选择 Nativefier 的情况：
- 您熟悉命令行操作
- 需要高度自定义配置
- 需要跨平台支持（Linux、macOS）
- 需要更高级的功能（如系统托盘、全局快捷键等）

## 📝 完整操作清单

- [ ] 下载并安装 Web2Executable
- [ ] 构建网页项目（`npm run build`）
- [ ] 准备应用图标（ICO 格式）
- [ ] 启动 Web2Executable
- [ ] 配置应用基本信息
- [ ] 设置窗口参数
- [ ] 选择源文件和输出目录
- [ ] 点击构建按钮
- [ ] 测试生成的 EXE 文件
- [ ] （可选）创建安装包

---

**提示**：Web2Executable 底层使用 NW.js 技术，与 Electron 类似，但配置更简单，适合快速原型和简单应用的打包需求。