FROM mophos/mmis-nginx

LABEL maintainer="Satit Rianpit <rianpit@gmail.com>"

WORKDIR /home/q4u/web

RUN npm i npm@latest -g 

RUN npm i -g pm2

COPY . .

COPY ./config/nginx.conf /etc/nginx

COPY ./config/process.json .

RUN npm i

RUN npm run build

CMD /usr/sbin/nginx && /usr/bin/pm2-runtime process.json

EXPOSE 80
