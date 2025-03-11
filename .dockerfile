# Step 1: Build the React app
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies for the React app
RUN npm install

# Copy the rest of the app's source code into the container
COPY . ./

# Build the React app (this will generate the 'build' folder)
RUN npm run build

# Step 2: Serve the React app using Nginx
FROM nginx:alpine
	
# Copy custom Nginx config for HTTPS
COPY nginx.conf /etc/nginx/nginx.conf
# Copy SSL certificates into the container
COPY certs/nginx.crt /etc/nginx/nginx.crt
COPY certs/nginx.key /etc/nginx/nginx.key

# Copy the build output from the previous stage to Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

	
# Expose ports for HTTP (80) and HTTPS (443)
EXPOSE 80 443

# Use the default Nginx configuration to serve the app
CMD ["nginx", "-g", "daemon off;"]



# Instructions to build and run the Docker image:

# 1. Build the Docker image:
#    docker build -t my-react-app .

# 2. Run the Docker container, mapping the container's port 80 to your host machine's port 80:
#    docker run -p 80:80 my-react-app

# 3. To run the container in the background (detached mode):
# docker run -p 80:80 -p 443:443 my-react-app

# 4. To check if your app is running, visit:
#    http://your-server-ip or http://your-domain.com (if DNS is set up)
