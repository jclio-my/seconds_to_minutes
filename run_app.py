#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
运行编译好的网页应用并自动打开浏览器
"""

import os
import sys
import subprocess
import webbrowser
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # 获取可执行文件所在目录
        if getattr(sys, 'frozen', False):
            # 如果是打包的可执行文件
            executable_dir = os.path.dirname(sys.executable)
        else:
            # 如果是直接运行的Python脚本
            executable_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 使用dist目录作为网页根目录
        dist_path = os.path.join(executable_dir, "dist")
        super().__init__(*args, directory=dist_path, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def build_project():
    """构建项目生成dist目录"""
    print("正在构建项目...")
    try:
        # 检查是否安装了依赖
        if not os.path.exists("node_modules"):
            print("正在安装依赖...")
            subprocess.run(["npm", "install"], check=True)
        
        # 构建项目
        subprocess.run(["npm", "run", "build"], check=True)
        print("项目构建完成！")
        return True
    except subprocess.CalledProcessError as e:
        print(f"构建失败: {e}")
        return False
    except FileNotFoundError:
        print("错误: 未找到npm。请确保已安装Node.js和npm。")
        return False

def start_server(port=3001):
    """启动本地HTTP服务器"""
    # 获取可执行文件所在目录
    if getattr(sys, 'frozen', False):
        # 如果是打包的可执行文件
        executable_dir = os.path.dirname(sys.executable)
    else:
        # 如果是直接运行的Python脚本
        executable_dir = os.path.dirname(os.path.abspath(__file__))
    
    os.chdir(executable_dir)
    
    # 检查dist目录是否存在
    dist_path = os.path.join(executable_dir, "dist")
    if not os.path.exists(dist_path):
        print("错误: dist目录不存在。请先构建项目。")
        return None
    
    try:
        server = HTTPServer(('localhost', port), CustomHTTPRequestHandler)
        print(f"服务器已启动在 http://localhost:{port}")
        return server
    except OSError as e:
        print(f"启动服务器失败: {e}")
        return None

def open_browser(url, delay=1.5):
    """延迟后打开浏览器"""
    time.sleep(delay)
    webbrowser.open(url)

def main():
    """主函数"""
    port = 3001
    
    # 如果dist目录不存在，先构建项目
    executable_dir = os.path.dirname(os.path.abspath(__file__)) if not getattr(sys, 'frozen', False) else os.path.dirname(sys.executable)
    dist_path = os.path.join(executable_dir, "dist")
    
    if not os.path.exists(dist_path):
        if not build_project():
            sys.exit(1)
    
    # 启动服务器
    server = start_server(port)
    if not server:
        sys.exit(1)
    
    url = f"http://localhost:{port}"
    
    # 在新线程中打开浏览器
    browser_thread = threading.Thread(target=open_browser, args=(url,))
    browser_thread.daemon = True
    browser_thread.start()
    
    print(f"正在打开浏览器访问 {url}")
    print("按 Ctrl+C 停止服务器")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n正在关闭服务器...")
        server.shutdown()
        server.server_close()
        print("服务器已关闭")

if __name__ == "__main__":
    main()