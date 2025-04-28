FROM node:18-slim

WORKDIR /app

COPY package*.json ./

# Force specific esbuild version to match
RUN npm install
RUN npm install esbuild@0.25.3 --save-exact

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]