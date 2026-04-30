# build stage with node image
FROM node:lts-alpine as build-stage

# create working dir
WORKDIR /app

# copy package file and install
COPY package*.json ./
RUN npm install

# Define build arguments to receive values from docker build or compose file
ARG VITE_APP_ENDPOINT

# Set environment variables for the build process (essential for Vite to pick them up)
ENV VITE_APP_ENDPOINT=$VITE_API_ENDPOINT


# copy application and build
COPY . .
RUN npm run build

# deploy stage nginx image
FROM nginx:stable-alpine as production-stage

# copy nginx default configuraiton 
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy app build to nginx html serve directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

## add permissions for nginx user
RUN chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

# set nginx as default user
USER nginx

# start nginx
CMD ["nginx", "-g", "daemon off;"] 