FROM node:alpine AS build

WORKDIR /app
COPY ["package*.json*", "./"]
RUN npm install

FROM node:alpine
COPY --from=build /app .
RUN mkdir src
ADD ["src", "./src/"]
CMD ["npm", "start"]
