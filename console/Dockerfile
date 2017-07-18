FROM node:8.1
MAINTAINER mkfsn<p408865@gmail.com>

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /home/app && cp -a /tmp/node_modules /home/app/

WORKDIR /home/app
COPY . .

RUN npm run build

EXPOSE 7070

CMD ["npm", "start"]
