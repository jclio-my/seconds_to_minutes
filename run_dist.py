#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
运行已编译好的dist目录中的网页应用并自动打开浏览器
"""

import os
import sys
import webbrowser
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # 获取可执行文件所在目录
        if getattr(sys, 'frozen', False):
            # 如果是打包的可执行文件
            executable_dir = os.path.dirname(sys.executable)
        else:
            # 如果是直接运行的Python脚本
            executable_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 使用可执行文件所在目录作为网页根目录
        super().__init__(*args, directory=executable_dir, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def start_server(port=3000):
    """启动本地HTTP服务器"""
    # 获取可执行文件所在目录
    if getattr(sys, 'frozen', False):
        # 如果是打包的可执行文件
        executable_dir = os.path.dirname(sys.executable)
    else:
        # 如果是直接运行的Python脚本
        executable_dir = os.path.dirname(os.path.abspath(__file__))
    
    os.chdir(executable_dir)
    
    # 检查dist目录是否存在（对于可执行文件，网页文件应该在当前目录）
    if not os.path.exists("index.html"):
        print("错误: 未找到网页文件。请确保index.html在可执行文件所在目录。")
        return None
    
    # 使用当前目录作为网页根目录
    web_root = executable_dir
    
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