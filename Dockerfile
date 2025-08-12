FROM node:22

WORKDIR /usr/src/app

COPY . .

EXPOSE 9229

RUN npm install

CMD ["bash"]
