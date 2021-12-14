FROM node:alpine as builder

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:alpine

WORKDIR /app

COPY --from=builder /app ./

CMD ["node", "dist/main"]
