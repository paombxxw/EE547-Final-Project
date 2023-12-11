# 使用官方 Node.js 镜像
FROM node:latest

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install -g npm@latest
RUN npm cache clean --force
RUN npm install -g node-pre-gyp

RUN npm install nodemailer

# 复制项目文件
COPY . .

# 暴露端口
EXPOSE 3000

# 运行应用
CMD ["node", "app.js"]
