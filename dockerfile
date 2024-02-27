FROM node:21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# FROM nginx:alpine AS runtime
# COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 8080

FROM node:21 as production
COPY --from=build /app/dist /app/dist
CMD ["sh", "-c", "cp -rf /app/dist/* /dist"]