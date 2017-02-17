FROM node:latest

# create app folder
RUN mkdir -p /usr/src/centilio/centilio-device-manager
WORKDIR /usr/src/centilio/centilio-device-manager

# install app dependencies
COPY package.json /usr/src/centilio/centilio-device-manager
RUN npm install

# copy source files
COPY . /usr/src/centilio/centilio-device-manager

# expose the port that the server listens to
EXPOSE 4123

# finally, the command to start the server
CMD ["npm", "start"]