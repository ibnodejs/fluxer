# base image
# FOR DEVELOPMENT ONLY
FROM arm64v8/node:14.17 as builder

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# copy source files
COPY . /usr/src

# install dependencies
RUN NODE_OPTIONS=--max_old_space_size=8192 yarn

# Build app
RUN NODE_OPTIONS=--max_old_space_size=8192 yarn build

FROM arm64v8/node:14.17-slim
COPY --from=builder /usr/src .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "build/index.js"]
