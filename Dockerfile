FROM busybox:1.28 AS fetch-pandoc
ARG PANDOC_VERSION=2.7.1


ADD https://github.com/jgm/pandoc/releases/download/${PANDOC_VERSION}/pandoc-${PANDOC_VERSION}-linux.tar.gz /pandoc.tar.gz
#COPY pandoc-${PANDOC_VERSION}-linux.tar.gz /pandoc.tar.gz
RUN tar -zxvf pandoc.tar.gz
RUN mv pandoc-${PANDOC_VERSION}/bin/pandoc /pandoc
RUN mv pandoc-${PANDOC_VERSION}/bin/pandoc-citeproc /pandoc-citeproc
RUN ["/pandoc", "-v"]

FROM node:8-alpine

# Create app directory
WORKDIR /usr/src/app

RUN apk add --no-cache libstdc++ bash ca-certificates git build-base

COPY --from=fetch-pandoc /pandoc /bin/pandoc
COPY --from=fetch-pandoc /pandoc-citeproc /bin/pandoc-citeproc

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "npm", "start" ]
