# Estágio 1: Construção (Build)
FROM node:18-alpine as build-stage

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o resto do código fonte
COPY . .

# Gera a versão otimizada para produção (cria a pasta /dist)
RUN npm run build

# Estágio 2: Produção (Nginx)
FROM nginx:alpine as production-stage

# Copia os arquivos gerados no estágio anterior para a pasta do Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Opcional: Copiar uma configuração customizada do nginx se necessário
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]