FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install --save-dev @vitejs/plugin-react
RUN npm install react-toastify
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]