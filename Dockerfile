FROM node:carbon

# the app directory
WORKDIR /usr/src/app

# copy package and package-lock jsons
COPY package*.json ./

RUN npm install

# bundle app source
COPY . .

EXPOSE 8080

CMD ["npm", "start"]

