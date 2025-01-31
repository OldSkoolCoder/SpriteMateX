FROM node:alpine AS builder

WORKDIR /spritematex

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

#----

FROM busybox:stable AS runner

WORKDIR /

EXPOSE 8080

COPY --from=builder /spritematex/dist /spritematex

CMD ["busybox", "httpd", "-f", "-v", "-p", "8080"]
