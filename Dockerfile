FROM node:6.9.4
ENV HOME=/home/app/

WORKDIR $HOME

COPY package.json .

RUN npm install --progress=false

COPY . .

CMD ["npm", "test"]
