FROM mhart/alpine-node:10.19 AS builder

WORKDIR /srv

COPY . .
RUN apk add libc6-compat
RUN yarn
RUN yarn build

# use lighter image
FROM mhart/alpine-node:slim-10.19
RUN apk add libc6-compat
COPY --from=builder /srv .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "build/index.js"]