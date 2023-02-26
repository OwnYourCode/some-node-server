FROM node:14 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:14-alpine as app

# copy from build and install
COPY --from=build /app/package*.json ./
RUN npm install --only=production && npm cache clean --force

# copy from build dist
COPY --from=build /app/dist ./dist

USER node
ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/main.js"]


