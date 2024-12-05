FROM node:18 AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:alpine AS production-stage

COPY --from=build-stage /app/dist/your-angular-app-name /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
# FROM nginx:alpine AS production-stage

# WORKDIR /usr/share/nginx/html

# COPY ./dist/portal .

# EXPOSE 3000

# CMD ["nginx", "-g", "daemon off;"]
