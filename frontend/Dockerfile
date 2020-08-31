FROM node:latest AS node-builder

WORKDIR /workspace

# Copy across package.json and yarn.lock and
# install depedencies.
# This is a separate step so it can be cached and the
# cache is used when not changing depedencies
COPY package.json yarn.lock /workspace/
RUN yarn install --pure-lockfile

COPY . /workspace
RUN yarn build

FROM alpine:latest
ENV GOPATH /usr/local

WORKDIR /workspace
RUN apk --no-cache add go git musl-dev && rm -rf /var/cache/apk/*
RUN go get -u github.com/m3ng9i/ran
COPY localhost* /root/

COPY --from=node-builder /workspace/build dist

WORKDIR /workspace/dist
CMD ran -p 443\
  --cert=/root/localhost.pem\
  --key=/root/localhost.key