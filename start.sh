#!/bin/bash

echo "🚀 启动实时汇率换算器..."
echo "📁 项目目录: $(pwd)"
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js未安装"
    echo "请先安装Node.js: https://nodejs.org/"
    exit 1
fi

# 检查端口是否被占用
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口3000已被占用，尝试停止现有进程..."
    kill $(lsof -t -i:3000) 2>/dev/null
    sleep 2
fi

# 启动服务器
echo "✅ 启动服务器..."
node server.js