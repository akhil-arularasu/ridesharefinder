# Build step #1: build the React front end
FROM node:20-alpine as build-step
RUN mkdir /app
WORKDIR /app
#ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
COPY ./src ./src
COPY ./public ./public
RUN npm install --force
RUN npm run build

#RUN yarn install --ignore-engines
#RUN yarn build

#EXPOSE 3000
#CMD ["npm","start"]
#CMD ["serve", "-s", "build", "-l", "3000" ]
# Build step #2: build an nginx container
#FROM nginx:stable-alpine
#COPY --from=build /app/build /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
#COPY /nginx/default.conf /etc/nginx/conf.d/default.conf
#CMD ["nginx", "-g", "daemon off;"]
#COPY --from=build-step /app/build /app/nginx/html
#COPY /nginx/default.conf /etc/nginx/conf.d/default.conf