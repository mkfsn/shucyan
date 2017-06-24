FROM node:8.1
MAINTAINER mkfsn<p408865@gmail.com>

WORKDIR /home/app
ADD . /home/app

RUN npm config set loglevel warn && npm install --silent --depth 0
RUN npm run build

EXPOSE 7070

CMD ["npm", "run", "serve"]
