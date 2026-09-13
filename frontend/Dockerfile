# Estágio 1: Build da aplicação Angular (Atualizado para Node 20)
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# Estágio 2: Servir os arquivos estáticos com Nginx
FROM nginx:alpine

COPY --from=build /app/dist/*/browser /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]