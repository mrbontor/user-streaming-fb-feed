FROM node:12-alpine
MAINTAINER mrbontor@gmail.com

# Replace shell with bash so we can source files
RUN ln -s /bin/sh /bin/bash

RUN apk update; apk add tzdata

# create app directory
WORKDIR /app

COPY package.json ./

RUN npm install --save

# Bundle app source
COPY . .

# Run the command on container startup
ENTRYPOINT ["npm", "start"]
