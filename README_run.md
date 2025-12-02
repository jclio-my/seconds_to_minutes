# 运行网页应用

本项目提供了两个Python脚本来运行编译好的网页应用并自动打开浏览器。

## 脚本说明

### 1. run_app.py
完整的运行脚本，包含自动构建功能：
- 自动检查并安装npm依赖（如果需要）
- 自动构建项目（生成dist目录）
- 启动本地服务器
- 自动打开浏览器访问应用

使用方法：
```bash
python3 run_app.py
```

### 2. run_dist.py
简化版运行脚本，仅用于运行已编译好的dist目录：
- 检查dist目录是否存在
- 启动本地服务器
- 自动打开浏览器访问应用

使用方法：
```bash
python3 run_dist.py
```

## 注意事项

1. 确保已安装Python 3
2. 如果使用`run_app.py`，请确保已安装Node.js和npm
3. 服务器默认运行在 http://localhost:3000
4. 按 Ctrl+C 可以停止服务器

## 手动构建（可选）

如果你想手动构建项目，可以运行：
```bash
npm install
npm run build
```

然后使用 `run_dist.py` 运行编译好的应用。