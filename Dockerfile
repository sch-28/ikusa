FROM node:16-slim
RUN apt-get update && apt-get install -y openssl
RUN npm install -g pnpm
WORKDIR /usr/src/app
COPY . .
RUN pnpm install && pnpm run build
EXPOSE 3000
USER node
CMD ["node", "build"]