FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@10.6.0
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]



# RUN npm install react-toastify    
# RUN npm install --save-dev @vitejs/plugin-react