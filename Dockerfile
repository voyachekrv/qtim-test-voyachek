FROM node:23.10.0-bullseye-slim

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

CMD ["npm", "run", "start:docker"]
