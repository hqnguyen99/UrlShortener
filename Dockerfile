FROM node:10.19.0
WORKDIR /app
COPY . .
RUN npm install --production
CMD ["node", "app.js"]