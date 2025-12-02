# 构建和打包说明

本项目支持使用PyInstaller将Python脚本打包为可执行文件，并通过GitHub Actions自动化构建流程。

## 本地构建

### 前置要求
- Python 3.11+
- Node.js和npm
- PyInstaller

### 安装依赖
```bash
pip install pyinstaller
npm install
```

### 构建网页应用
```bash
npm run build
```

### 打包Python脚本

#### 打包run_app.py（包含自动构建功能）
```bash
pyinstaller --clean run_app.spec
```

#### 打包run_dist.py（仅运行已编译版本）
```bash
pyinstaller --clean run_dist.spec
```

打包后的可执行文件将位于 `dist/` 目录中。

## GitHub Actions自动化构建

### 触发条件
- 推送到 main/master 分支
- 创建标签（格式：v*）
- 手动触发（workflow_dispatch）

### 支持的平台
- Ubuntu (linux)
- Windows (windows)
- macOS (macos)

### 构建产物
每个平台会生成两个可执行文件：
- `run_app` - 完整版本，包含自动构建功能
- `run_dist` - 简化版本，仅运行已编译的网页应用

### 发布流程
1. 创建标签：`git tag v1.0.0`
2. 推送标签：`git push origin v1.0.0`
3. GitHub Actions将自动构建并创建发布包

## 使用说明

### run_app（完整版）
- 自动检查并安装npm依赖
- 自动构建项目
- 启动本地服务器
- 自动打开浏览器

### run_dist（简化版）
- 直接启动本地服务器
- 自动打开浏览器
- 需要预先构建好的dist目录

## 注意事项

1. 服务器默认运行在 http://localhost:3001
2. 按 Ctrl+C 可以停止服务器
3. 可执行文件会自动检测网页文件位置
4. 支持跨平台运行（Windows、Linux、macOS）

## 故障排除

如果遇到端口占用问题，可以修改Python脚本中的端口号（默认为3001）。

如果可执行文件无法找到网页文件，请确保：
- 对于run_dist：index.html和assets目录在可执行文件同一目录
- 对于run_app：dist目录在可执行文件同一目录