# Nativefier 打包时间转换器为 EXE 完整指南

## 📋 当前状态

✅ **已完成**：
- 安装 Nativefier
- 构建网页项目 (`npm run build`)
- 成功创建 Linux 版本应用

✅ **测试结果**：
- Linux 版本应用已成功启动
- 应用运行正常，显示时间转换器界面

## 🎯 在 Windows 上创建 EXE 文件的步骤

### 方法一：在 Windows 系统上直接操作（推荐）

1. **准备环境**：
   ```cmd
   # 确保已安装 Node.js 和 npm
   node -v
   npm -v
   
   # 全局安装 Nativefier
   npm install -g nativefier
   ```

2. **构建项目**：
   ```cmd
   # 在项目根目录执行
   npm run build
   ```

3. **打包为 EXE**：
   ```cmd
   # 基础版本
   nativefier --name "时间转换器" --platform windows --arch x64 dist/
   
   # 完整版本（推荐）
   nativefier \
     --name "时间转换器" \
     --platform windows \
     --arch x64 \
     --width 1200 \
     --height 800 \
     --single-instance \
     --disable-dev-tools \
     --out "release" \
     dist/
   ```

4. **高级版本（带更多自定义选项）**：
   ```cmd
   nativefier \
     --name "时间转换器" \
     --platform windows \
     --arch x64 \
     --width 1200 \
     --height 800 \
     --min-width 800 \
     --min-height 600 \
     --single-instance \
     --disable-dev-tools \
     --always-on-top \
     --tray \
     --app-version "1.0.0" \
     --app-copyright "时间转换器版权所有" \
     --out "release" \
     dist/
   ```

### 方法二：在 Linux 上使用 Wine（跨平台构建）

1. **安装 Wine**：
   ```bash
   sudo apt-get update
   sudo apt-get install -y wine
   ```

2. **配置 Wine**：
   ```bash
   winecfg
   ```

3. **重新执行打包命令**：
   ```bash
   nativefier --name "时间转换器" --platform windows --arch x64 --width 1200 --height 800 --single-instance --disable-dev-tools --out "release" dist/
   ```

## 📁 生成的文件结构

打包成功后，您会得到类似这样的目录结构：

```
release/
└── 时间转换器-win32-x64/
    ├── 时间转换器.exe          # 主执行文件
    ├── resources/              # 应用资源
    │   ├── app/                # 应用代码
    │   └── icon.ico            # 应用图标
    ├── ...                     # 其他 Electron 运行时文件
```

## 🚀 使用说明

1. **直接运行**：
   - 双击 `时间转换器.exe` 即可启动应用
   - 应用将在独立的窗口中运行，无需浏览器

2. **分发方式**：
   - 将整个 `时间转换器-win32-x64` 文件夹打包成 ZIP 文件分发
   - 用户解压后直接运行 EXE 文件即可

3. **创建安装包**（可选）：
   - 使用 Inno Setup 等工具创建专业的安装程序
   - 可以添加桌面快捷方式、开始菜单项等

## 🔧 常用参数说明

| 参数 | 说明 | 示例值 |
|------|------|--------|
| `--name` | 应用名称 | "时间转换器" |
| `--platform` | 目标平台 | windows/linux/osx |
| `--arch` | 架构 | x64/ia32/arm64 |
| `--width` | 窗口宽度 | 1200 |
| `--height` | 窗口高度 | 800 |
| `--single-instance` | 单实例运行 | - |
| `--disable-dev-tools` | 禁用开发者工具 | - |
| `--always-on-top` | 窗口置顶 | - |
| `--tray` | 系统托盘支持 | - |
| `--icon` | 自定义图标 | "icon.ico" |

## 🐛 常见问题解决

1. **图标问题**：
   - Windows 需要 `.ico` 格式图标
   - 推荐尺寸：256x256 像素
   - 可以使用在线工具转换 PNG 到 ICO

2. **应用闪退**：
   - 尝试降低 Electron 版本：`--electron-version 19.0.0`
   - 检查网页路径是否正确

3. **权限问题**：
   - Windows 上可能需要管理员权限
   - 确保输出目录有写入权限

## 📊 当前项目信息

- **项目名称**：时间转换器
- **技术栈**：React + TypeScript + Vite + Tailwind CSS
- **构建输出**：`dist/` 目录
- **Linux 版本**：已成功创建在 `时间转换器-linux-x64/`
- **Windows 版本**：需要在 Windows 系统上创建

## 🎉 下一步

1. 在 Windows 系统上按照上述步骤创建 EXE 文件
2. 测试 EXE 文件的功能
3. 如需分发，可考虑创建安装包
4. 可以添加自定义图标和更多个性化设置

---

**提示**：如果您需要我帮助创建自定义图标或其他配置文件，请告诉我！