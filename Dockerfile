FROM node:16-slim
RUN apt-get update && apt-get install -y openssl
WORKDIR /usr/src/app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
USER node
CMD ["node", "build"]