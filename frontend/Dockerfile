FROM node:18-alpine as build-stage


WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm ci
ARG API_URL
ENV API_URL $API_URL
ARG API_PATH
ENV API_PATH $API_PATH
RUN npm run build

FROM nginx:stable-alpine as production-stage
RUN mkdir /app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist/spa  /app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
