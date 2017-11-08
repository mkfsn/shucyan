FROM node:8.1
MAINTAINER mkfsn<p408865@gmail.com>

USER node
RUN mkdir /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

# set npm loglevel back to warn
# https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm install -g angular-cli && npm install --unsafe-perm
RUN mkdir -p /home/node/app && cp -a /tmp/node_modules /home/node/app/

WORKDIR /home/node/app
COPY . .

RUN npm run build

EXPOSE 7070

CMD ["npm", "start"]
