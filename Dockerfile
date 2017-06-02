FROM node:6.9.4
ENV HOME=/home/app/
ENV HARVESTJS=/home/harvestjs/

WORKDIR $HOME

COPY package.json .

RUN npm install --progress=false

COPY . .

WORKDIR $HARVESTJS

COPY harvesterjs .

RUN npm link

WORKDIR $HOME

RUN npm link harvesterjs

CMD ["npm", "test"]
