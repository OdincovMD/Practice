FROM node:16
RUN apt-get update -y
WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm install easy-magnify-waft
COPY . .
EXPOSE 3000
VOLUME ["/app/img"]
CMD [ "npm", "start" ]
 