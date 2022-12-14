FROM node:lts-alpine
COPY package.json /data/
WORKDIR /data/
RUN yarn install
ENV PATH /data/node_modules/.bin:$PATH
COPY . /data/app/
WORKDIR /data/app/
CMD ["yarn", "run", "dev"]