FROM node:16.13.1

WORKDIR /usr/killuabot

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "bot.js"]

