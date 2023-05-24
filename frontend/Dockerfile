FROM node:18-alpine as build-stage


WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm build

FROM nginx:stable-alpine as production-stage
RUN mkdir /app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]