FROM node:lts-alpine

COPY package.json /frontend/
WORKDIR /frontend/
RUN yarn install
ENV PATH /frontend/node_modules/.bin:$PATH

COPY . /frontend/app/
WORKDIR /frontend/app/
CMD ["yarn", "run", "dev"]