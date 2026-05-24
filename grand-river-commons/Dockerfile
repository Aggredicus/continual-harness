FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY index.html ./
COPY src ./src
COPY tests ./tests
COPY scripts ./scripts

ENV HOST=0.0.0.0
ENV PORT=5173

EXPOSE 5173

CMD ["npm", "run", "dev"]
