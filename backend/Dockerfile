FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código-fonte do backend
COPY . .

# Expõe a porta em que o Express roda
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]